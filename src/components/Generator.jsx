import { useEffect, useState } from 'react';
import styles from '../styles/Generator.module.css'
import { db } from "../firebase";
import { collection, getDocs } from 'firebase/firestore';



const Generator = () => {
    const [excelData, setExcelData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const colRef = collection(db, "excelData");
        const snap = await getDocs(colRef);
        const data = snap.docs.map(doc => {
        const d = doc.data();
        return {
            id: doc.id,
            hara: d.Harga,
            kemasan: d.Kemasan,
            link: d["Link E-katalog"],
            nie: d.NIE,
            name: d["Nama Produk"],
            no: d.no
        };
    });
        setExcelData(data);
    }

    const handleSelect = () => {
        console.log("hit");

    }
    return (
        <div className={styles.container}>
            <div className={styles.search}>
                <input type="text" placeholder='Enter Code' />
            </div>
            <div className={styles.tables}>
                {excelData.length > 0 ? (
                    excelData.map((data) => (
                        <div className={styles.data} key={data.id}>
                            {data["Product's Name"] || data.name || "Unnamed"}
                            <button className={styles.button} onClick={handleSelect}>+</button>
                        </div>
                    ))
                ) : (
                        <p>No data found.</p>
                )}
            </div>
        </div>
     );
}

export default Generator;