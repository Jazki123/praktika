import React, { useEffect, useState } from 'react'
import { reviewApi, prepodApi, courseApi } from '../api/api'
import './CoursesPage.css'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [text, setText] = useState('')
  const [grates, setGrates] = useState(5)
  const [date, setDate] = useState('')
  const [prepods, setPrepods] = useState([])
  const [courses, setCourses] = useState([])
  const [selPrep, setSelPrep] = useState('')
  const [selCour, setSelCour] = useState('')
  const [error, setError] = useState('')        // для отображения ошибок

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
      setError('')
    } catch (e) {
      console.error(e)
      setError('Ошибка при загрузке данных')
    }
  }

  const add = async () => {
    try {
      await reviewApi.create({
        text,
        grates: Number(grates),
        dateReview: date,
        prepodId: Number(selPrep),
        courseId: Number(selCour)
      })
      setText('')
      setGrates(5)
      setDate('')
      setSelPrep('')
      setSelCour('')
      setError('')
      loadAll()
    } catch (e) {
      console.error(e)
      setError('Ошибка при добавлении отзыва')
    }
  }

  const del = async id => {
    try {
      await reviewApi.remove(id)
      setError('')
      loadAll()
    } catch (e) {
      console.error(e)
      setError('Ошибка при удалении отзыва')
    }
  }

  const filteredCourses = selPrep
    ? courses.filter(c => c.prepodId === Number(selPrep))
    : courses

  return (
    <div className="courses-container">
      <h2 className="courses-header">Отзывы</h2>

      {/* Отображаем ошибку, если есть */}
      {error && <div className="error-message">{error}</div>}

      <div className="courses-form">
        <textarea
          placeholder="Текст"
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ flex: '1 1 100%' }}
        />
        <input
          type="number"
          min="1"
          max="5"
          value={grates}
          onChange={e => setGrates(e.target.value)}
          style={{ flex: '0 0 80px' }}
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          style={{ flex: '0 0 150px' }}
        />
        <select
          value={selPrep}
          onChange={e => { setSelPrep(e.target.value); setSelCour('') }}
          style={{ flex: '1 1 150px' }}
        >
          <option value="">Преподаватель</option>
          {prepods.map(p => (
            <option key={p.id} value={p.id}>{p.fio}</option>
          ))}
        </select>
        <select
          value={selCour}
          onChange={e => setSelCour(e.target.value)}
          disabled={!selPrep}
          style={{ flex: '1 1 150px' }}
        >
          <option value="">{selPrep ? 'Курс' : 'Сначала выберите препода'}</option>
          {filteredCourses.map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <button
          onClick={add}
          disabled={!text || !date || !selPrep || !selCour}
        >
          Добавить
        </button>
      </div>

      <ul className="courses-list">
        {reviews.map(r => (
          <li key={r.id} className="courses-list-item">
            <div>
              <strong>{r.dateReview}</strong> {r.text} — оценка: {r.grates}
            </div>
            <button onClick={() => del(r.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  )
}