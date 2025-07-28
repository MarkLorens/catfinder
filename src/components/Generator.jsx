import { useEffect, useState } from 'react';
import styles from '../styles/Generator.module.css'
import { db } from "../firebase";
import { collection, getDocs } from 'firebase/firestore';



const Generator = () => {
    const [excelData, setExcelData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;


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

    const handleSelect = (data) => {
        console.log(data);
    }


    const filteredData = excelData.filter((item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className={styles.container}>
            <div className={styles.search}>
                <input type="text" placeholder='Enter Code' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            </div>
            <div className={styles.tables}>
                {filteredData.length > 0 ? (
                    paginatedData.map((data) => (
                        <div className={styles.data} key={data.id}>
                            {data.name || "Unnamed"}
                            <button className={styles.button} onClick={() => handleSelect(data)}>+</button>
                        </div>
                    ))
                ) : (
                        <p>No data found.</p>
                )}
            </div>
            <div className={styles.pagination}>
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                <div className={styles.page}>
                    <span>Page {currentPage} of {totalPages}</span>
                </div>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

        </div>
     );
}

export default Generator;