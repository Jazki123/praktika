import React, { useEffect, useState } from 'react';
import { reviewApi, prepodApi, courseApi } from '../api/api';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState('');
  const [grates, setGrates] = useState(5);
  const [date, setDate] = useState('');
  const [prepods, setPrepods] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selPrep, setSelPrep] = useState('');
  const [selCour, setSelCour] = useState('');

  useEffect(() => { loadAll(); }, []);
  const loadAll = async() =>{
    try{
      const [rRes,pRes,cRes]=await Promise.all([reviewApi.list(),prepodApi.list(),courseApi.list()]);
      setReviews(rRes.data); setPrepods(pRes.data); setCourses(cRes.data);
    }catch(e){console.error(e);}
  };

  const add = async()=>{
    try{
      await reviewApi.create({ text, grates:+grates, date_otzyv:date, prepodId:+selPrep, courseId:+selCour });
      setText(''); setGrates(5); setDate(''); setSelPrep(''); setSelCour(''); loadAll();
    }catch(e){console.error(e);}  };

  const del = async id=>{ try{ await reviewApi.remove(id); loadAll(); }catch(e){console.error(e);} };

  return (
    <div style={{ padding:20 }}>
      <h2>Отзывы</h2>
      <div>
        <textarea placeholder="Текст" value={text} onChange={e=>setText(e.target.value)}/>
        <input type="number" min="1" max="5" value={grates} onChange={e=>setGrates(e.target.value)}/>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)}/>
        <select value={selPrep} onChange={e=>setSelPrep(e.target.value)}>
          <option value="">Преподаватель</option>
          {prepods.map(p=>(<option key={p.id} value={p.id}>{p.fio}</option>))}
        </select>
        <select value={selCour} onChange={e=>setSelCour(e.target.value)}>
          <option value="">Курс</option>
          {courses.map(c=>(<option key={c.id} value={c.id}>{c.title}</option>))}
        </select>
        <button onClick={add}>Добавить</button>
      </div>
      <ul>
        {reviews.map(r=>(
          <li key={r.id}>
            [{r.date_otzyv}] {r.text} (Оценка: {r.grates}) — prepod:{r.prepodId}, course:{r.courseId}
            <button onClick={()=>del(r.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
