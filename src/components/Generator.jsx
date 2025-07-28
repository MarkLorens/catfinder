import { useEffect, useState } from 'react';
import styles from '../styles/Generator.module.css'
import { db } from "../firebase";
import { collection, getDocs } from 'firebase/firestore';



const Generator = () => {
    const [excelData, setExcelData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [selectedData, setSelectedData] = useState([]);


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
            harga: d[" Harga "] ,
            kemasan: d.Kemasan,
            link: d["Link E-katalog"],
            nie: d.NIE,
            name: d["Nama Produk"],
            no: d.No
        };
    });
        setExcelData(data);
    }

    const handleSelect = (data) => {
        setSelectedData(prev => {
            if(prev.find(item => item.id === data.id)) return prev;
            return [...prev, data];
        });
    };

    const handleRemove = (id) => {
        setSelectedData(prev => prev.filter(item => item.id !== id));
    }

    const generateExcel = () => {
        if(selectedData.length < 1) {
            alert("Please add data before generating.");
            return;
        }

        alert("Nice");
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
                <input type="text" placeholder='Enter Code' name='search-input' id='SearchInput' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
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

            <div className={styles.tables}>
                <input type="button" name="submit-button" id="Submit Button" value="Selesai" className={styles.submit} onClick={() => generateExcel(selectedData)}/>
                <h3>Selected Items:</h3>
                {selectedData.length > 0 ? (
                    selectedData.map(item => (
                    <div key={item.id} className={styles.data}>
                        {item.name || "unnamed" }
                        <button className={styles.button} onClick={() => handleRemove(item.id)}>-</button>
                    </div>
                    ))
                ) : (
                    <p>No items selected.</p>
                )}
            </div>

        </div>
     );
}

export default Generator;