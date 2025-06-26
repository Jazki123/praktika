// src/pages/CoursesPage.js
import React, { useEffect, useState } from 'react'
import { courseApi, prepodApi } from '../api/api'

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
        prepodApi.list()
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
        prepodId: Number(selectedPrepod)
      })
      setTitle('')
      setFacult('')
      setSelectedPrepod('')
      loadAll()
    } catch (e) {
      console.error(e)
    }
  }

  const del = async id => {
    try {
      await courseApi.remove(id)
      loadAll()
    } catch (e) {
      console.error(e)
    }
  }


  const totalPages = Math.ceil(courses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentItems = courses.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div style={{ padding: 20 }}>
      <h2>Курсы</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Название"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          placeholder="Факультет"
          value={facult}
          onChange={e => setFacult(e.target.value)}
        />
        <select
          value={selectedPrepod}
          onChange={e => setSelectedPrepod(e.target.value)}
        >
          <option value="">Преподаватель</option>
          {prepods.map(p => (
            <option key={p.id} value={p.id}>
              {p.fio}
            </option>
          ))}
        </select>
        <button onClick={add}>Добавить</button>
      </div>

      <ul>
        {currentItems.map(c => (
          <li key={c.id} style={{ marginBottom: 8 }}>
            {c.title} ({c.facult}) — prepodId: {c.prepodId}
            <button
              style={{ marginLeft: 10 }}
              onClick={() => del(c.id)}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
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
          onClick={() =>
            setCurrentPage(prev => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  )
}
