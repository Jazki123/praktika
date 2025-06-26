import React, { useEffect, useState } from 'react'
import { reviewApi, prepodApi, courseApi } from '../api/api'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [text, setText] = useState('')
  const [grates, setGrates] = useState(5)
  const [date, setDate] = useState('')
  const [prepods, setPrepods] = useState([])
  const [courses, setCourses] = useState([])
  const [selPrep, setSelPrep] = useState('')
  const [selCour, setSelCour] = useState('')

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    try {
      const [rRes, pRes, cRes] = await Promise.all([
        reviewApi.list(),
        prepodApi.list(),
        courseApi.list()
      ])
      setReviews(rRes.data)
      setPrepods(pRes.data)
      setCourses(cRes.data)
    } catch (e) {
      console.error(e)
    }
  }

  const add = async () => {
    try {
      await reviewApi.create({
        text,
        grates: Number(grates),
        date_review: date,
        prepodId: Number(selPrep),
        courseId: Number(selCour)
      })
      setText('')
      setGrates(5)
      setDate('')
      setSelPrep('')
      setSelCour('')
      loadAll()
    } catch (e) {
      console.error(e)
    }
  }

  const del = async id => {
    try {
      await reviewApi.remove(id)
      loadAll()
    } catch (e) {
      console.error(e)
    }
  }

  // отфильтрованный список курсов по выбранному преподавателю
  const filteredCourses = selPrep
    ? courses.filter(c => c.prepodId === Number(selPrep))
    : courses

  return (
    <div style={{ padding: 20 }}>
      <h2>Отзывы</h2>
      <div style={{ marginBottom: 12 }}>
        <textarea
          placeholder="Текст"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <input
          type="number"
          min="1"
          max="5"
          value={grates}
          onChange={e => setGrates(e.target.value)}
          style={{ width: 60, marginLeft: 8 }}
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          style={{ marginLeft: 8 }}
        />

        <select
          value={selPrep}
          onChange={e =>{
            setSelPrep(e.target.value)
            setSelCour('') // сброс курса при смене преподавателя
          }}
          style={{ marginLeft: 8 }}
        >
          <option value="">Преподаватель</option>
          {prepods.map(p => (
            <option key={p.id} value={p.id}>
              {p.fio}
            </option>
          ))}
        </select>

        <select
          value={selCour}
          onChange={e => setSelCour(e.target.value)}
          disabled={!selPrep}
          style={{ marginLeft: 8 }}
        >
          <option value="">
            {selPrep ? 'Курс' : 'Сначала выберите препода'}
          </option>
          {filteredCourses.map(c => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        <button
          onClick={add}
          disabled={!text || !date || !selPrep || !selCour}
          style={{ marginLeft: 8 }}
        >
          Добавить
        </button>
      </div>

      <ul>
        {reviews.map(r => (
          <li key={r.id} style={{ marginBottom: 6 }}>
            [{r.date_review}] {r.text} (Оценка: {r.grates}) — prepod:{r.prepodId}, course:{r.courseId}{' '}
            <button onClick={() => del(r.id)} style={{ marginLeft: 6 }}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
