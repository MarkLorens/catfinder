import styles from '../styles/FilePicker.module.css'
import * as XLSX from 'xlsx'
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, limit} from 'firebase/firestore';

const FilePicker = () => {
    const [fileName, setFileName] = useState('');
    const [jsonData, setJsonData] = useState(null);


    useEffect(() => {
        handleFileName();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(!file) return;

        // Validate file type
        if(!/\.(xlsx|xls)$/i.test(file.name)) {
            alert("Please upload a valid Excel File (.xls or .xlsx)");
            return;
        }

        setFileName(file.name)
        document.querySelector("#FileName").classList.add('active');

        // Read as binary string
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, {type: 'array'});

                // Convert first sheet to JSON
                const sheetName = workbook.SheetNames?.[0];
                if (!sheetName) {
                    alert("No sheets found in workbook.");
                    return
                }
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                setJsonData(json);
                await uploadToFirebase(json, file.name);
            } catch (err) {
                console.error("Error processing file.");
                alert("Something went wrong processing your file.")
            }
        }

        reader.readAsArrayBuffer(file)
    }

    const uploadToFirebase = async (data, fileName) => {
        try {
            const colRef = collection(db, "excelData")
            for (const item of data) {
                await addDoc(colRef, item)
            }
            await addDoc(collection(db, "uploads"), {
                fileName,
                uploadedAt: new Date(),
                rowCount: data.length,
            })
            alert('Data uploaded successfully!');
        } catch (err) {
            console.error(err)
            alert('Upload failed.');
        }
    }

    const handleFileName = async () => {
        const uploadsRef = collection(db, "uploads");
        const q = query(uploadsRef, orderBy("uploadedAt", "desc"), limit(1));
        const snap = await getDocs(q);

        if (!snap.empty) {
            const latest = snap.docs[0].data();
            setFileName(latest.fileName);
        } else {
            setFileName("No file selected");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.inputs}>
                <div className={styles.upload}>
                    <label htmlFor="file-upload" className={styles.custom_file_upload}>
                        Uploaded File
                    </label>
                    <input id="file-upload" type="file" accept='.xls,.xlsx' onChange={handleFileChange} />
                </div>
                <div className={styles.current_file}>
                    <span id='FileName'>{fileName || 'No file selected'}</span>
                </div>
            </div>
        </div>
    );
}

export default FilePicker;