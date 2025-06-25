import React, { useEffect, useState } from 'react';
import { prepodApi } from '../api/api';

export default function PrepodsPage() {
  const [list, setList] = useState([]);
  const [fio, setFio] = useState('');
  const [kafedra, setKafedra] = useState('');

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

  return (
    <div style={{ padding:20 }}>
      <h2>Преподаватели</h2>
      <div>
        <input placeholder="ФИО" value={fio} onChange={e=>setFio(e.target.value)}/>
        <input placeholder="Кафедра" value={kafedra} onChange={e=>setKafedra(e.target.value)}/>
        <button onClick={add}>Добавить</button>
      </div>
      <ul>
        {list.map(p=>(
          <li key={p.id}>
            {p.fio} ({p.kafedra})
            <button onClick={()=>del(p.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}