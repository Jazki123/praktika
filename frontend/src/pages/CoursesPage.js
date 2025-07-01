import React, { useEffect, useState } from 'react'
import { courseApi, prepodApi } from '../api/api'
import './CoursesPage.css'


function getPageItems(currentPage, totalPages) {
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  return [1, 2, 3, '...', totalPages]
}

export default function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [title, setTitle] = useState('')
  const [facult, setFacult] = useState('')
  const [prepods, setPrepods] = useState([])
  const [selectedPrepod, setSelectedPrepod] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    try {
      const [cRes, pRes] = await Promise.all([
        courseApi.list(),
        prepodApi.list(),
      ])
      setCourses(cRes.data)
      setPrepods(pRes.data)
    } catch (e) {
      console.error(e)
    }
  }

  const add = async () => {
    try {
      await courseApi.create({
        title,
        facult,
        prepodId: Number(selectedPrepod),
      })
      setTitle('')
      setFacult('')
      setSelectedPrepod('')
      loadAll()
    } catch (e) {
      console.error(e)
    }
  }

  const del = async (id) => {
    try {
      await courseApi.remove(id)
      loadAll()
    } catch (e) {
      console.error(e)
    }
  }

  
  const filtered = selectedPrepod
    ? courses.filter((c) => c.prepodId === Number(selectedPrepod))
    : courses

 
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage)
  const pages = getPageItems(currentPage, totalPages)

  
  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1))
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages))

  return (
    <div className="courses-container">
      <h2 className="courses-header">Курсы</h2>

      <div className="courses-form">
        <input
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Факультет"
          value={facult}
          onChange={(e) => setFacult(e.target.value)}
        />
        <select
          value={selectedPrepod}
          onChange={(e) => setSelectedPrepod(e.target.value)}
        >
          <option value="">Преподаватель</option>
          {prepods.map((p) => (
            <option key={p.id} value={p.id}>
              {p.fio}
            </option>
          ))}
        </select>
        <button onClick={add}>Добавить</button>
      </div>

      <ul className="courses-list">
        {currentItems.map((c) => (
          <li key={c.id} className="courses-list-item">
            <span>
              {c.title} ({c.facult})
            </span>
            <span>prepodId: {c.prepodId}</span>
            <button onClick={() => del(c.id)}>Удалить</button>
          </li>
        ))}
      </ul>

      <div className="pagination">
        <button onClick={goPrev} disabled={currentPage === 1}>
          Prev
        </button>
        {pages.map((p, idx) => (
          <button
            key={idx}
            onClick={() => typeof p === 'number' && setCurrentPage(p)}
            disabled={p === '...' || currentPage === p}
            className={currentPage === p ? 'active' : ''}
          >
            {p}
          </button>
        ))}
        <button onClick={goNext} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  )
}
