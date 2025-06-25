import React, { useEffect, useState } from 'react';
import { courseApi, prepodApi } from '../api/api';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [facult, setFacult] = useState('');
  const [prepods, setPrepods] = useState([]);
  const [selectedPrepod, setSelectedPrepod] = useState('');

  useEffect(() => { loadAll(); }, []);
  const loadAll = async () => {
    try {
      const [cRes, pRes] = await Promise.all([courseApi.list(), prepodApi.list()]);
      setCourses(cRes.data);
      setPrepods(pRes.data);
    } catch(e){ console.error(e); }
  };

  const add = async () => {
    try {
      await courseApi.create({ title, facult, prepodId:+selectedPrepod });
      setTitle(''); setFacult(''); setSelectedPrepod(''); loadAll();
    } catch(e){ console.error(e); }
  };

  const del = async id => { try{ await courseApi.remove(id); loadAll(); }catch(e){console.error(e);} };

  return (
    <div style={{ padding:20 }}>
      <h2>Курсы</h2>
      <div>
        <input placeholder="Название" value={title} onChange={e=>setTitle(e.target.value)}/>
        <input placeholder="Факультет" value={facult} onChange={e=>setFacult(e.target.value)}/>
        <select value={selectedPrepod} onChange={e=>setSelectedPrepod(e.target.value)}>
          <option value="">Преподаватель</option>
          {prepods.map(p=>(<option key={p.id} value={p.id}>{p.fio}</option>))}
        </select>
        <button onClick={add}>Добавить</button>
      </div>
      <ul>
        {courses.map(c=>(
          <li key={c.id}>
            {c.title} ({c.facult}) — prepodId: {c.prepodId}
            <button onClick={()=>del(c.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
