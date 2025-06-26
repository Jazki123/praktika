import React, { useEffect, useState } from 'react';
import { prepodApi } from '../api/api';

export default function PrepodsPage() {
  const [list, setList] = useState([]);
  const [fio, setFio] = useState('');
  const [kafedra, setKafedra] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { load(); }, []);
  const load = async () => {
    try { const res = await prepodApi.list(); setList(res.data); }
    catch(e){ console.error(e); }
  };

  const add = async () => {
    try {
      await prepodApi.create({ fio, kafedra });
      setFio(''); setKafedra('');
      load();
    } catch(e) { console.error(e); }
  };

  const del = async id => {
    try { await prepodApi.remove(id); load(); } catch(e){ console.error(e); }
  };

  const totalPages = Math.ceil(list.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = list.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div style={{ padding: 20 }}>
      <h2>Преподаватели</h2>
      <div style={{ marginBottom: 20 }}>
        <input placeholder="ФИО" value={fio} onChange={e => setFio(e.target.value)} />
        <input placeholder="Кафедра" value={kafedra} onChange={e => setKafedra(e.target.value)} />
        <button onClick={add}>Добавить</button>
      </div>
      <ul>
        {currentItems.map(p => (
          <li key={p.id} style={{ marginBottom: 8 }}>
            {p.fio} ({p.kafedra})
            <button style={{ marginLeft: 10 }} onClick={() => del(p.id)}>Удалить</button>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 20 }}>
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            disabled={currentPage === i + 1}
            style={{ margin: '0 4px' }}
          >
            {i + 1}
          </button>
        ))}
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
