import { useEffect, useState } from 'react';
import styles from '../styles/Generator.module.css'
import { db } from "../firebase";
import { collection, getDocs } from 'firebase/firestore';



const Generator = () => {
    const [excelData, setExcelData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");


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

    const filteredData = excelData.filter((item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.search}>
                <input type="text" placeholder='Enter Code' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            </div>
            <div className={styles.tables}>
                {filteredData.length > 0 ? (
                    filteredData.map((data) => (
                        <div className={styles.data} key={data.id}>
                            {data.name || "Unnamed"}
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