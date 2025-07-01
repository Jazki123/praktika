import React, { useEffect, useState } from 'react';
import { prepodApi, reviewApi } from '../api/api';
import './CoursesPage.css';

function getPageItems(currentPage, totalPages) {
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  return [1, 2, 3, '...', totalPages];
}

export default function PrepodsPage() {
  const [list, setList] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedPrepId, setSelectedPrepId] = useState(null);
  const [fio, setFio] = useState('');
  const [kafedra, setKafedra] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');              // <-- новое состояние для ошибки
  const itemsPerPage = 10;

  useEffect(() => {
    loadPrepods();
  }, []);

  const loadPrepods = async () => {
    try {
      const res = await prepodApi.list();
      setList(res.data);
      setError('');                                  // сбрасываем ошибку при успешной загрузке
    } catch (e) {
      console.error(e);
      setError('Ошибка при загрузке преподавателей');
    }
  };

  const loadReviews = async (prepodId) => {
    try {
      const res = await reviewApi.list();
      setReviews(res.data.filter(r => r.prepodId === prepodId));
      setSelectedPrepId(prepodId);
      setError('');
    } catch (e) {
      console.error(e);
      setError('Ошибка при загрузке отзывов');
    }
  };

  const add = async () => {
    try {
      await prepodApi.create({ fio, kafedra });
      setFio(''); setKafedra('');
      loadPrepods();
    } catch (e) {
      console.error(e);
      setError('Ошибка при добавлении преподавателя');
    }
  };

  const del = async (id) => {
    try {
      await prepodApi.remove(id);
      // если удалилось — обновляем список и чистим состояние
      loadPrepods();
      if (id === selectedPrepId) {
        setSelectedPrepId(null);
        setReviews([]);
      }
    } catch (e) {
      console.error(e);
      // если сервер вернул 409 Conflict — FK-ограничение
      if (e.response && e.response.status === 409) {
        setError('Нельзя удалить: есть связанные курсы или отзывы');
      } else {
        setError('Ошибка при удалении преподавателя');
      }
    }
  };

  // пагинация преподавателей
  const totalPages = Math.ceil(list.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = list.slice(startIndex, startIndex + itemsPerPage);
  const pages = getPageItems(currentPage, totalPages);

  // средний балл по отзывам (если нужно)
  const averageGrates = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.grates, 0) / reviews.length).toFixed(2)
    : null;

  return (
    <div className="prepods-container">
      <h2 className="prepods-header">Преподаватели</h2>

      {/* Показываем ошибку, если есть */}
      {error && <div className="error-message">{error}</div>}

      <div className="prepods-form">
        <input
          placeholder="ФИО"
          value={fio}
          onChange={e => setFio(e.target.value)}
        />
        <input
          placeholder="Кафедра"
          value={kafedra}
          onChange={e => setKafedra(e.target.value)}
        />
        <button onClick={add}>Добавить</button>
      </div>

      <ul className="prepods-list">
        {currentItems.map(p => (
          <li key={p.id} className="prepods-list-item">
            <span onClick={() => loadReviews(p.id)}>
              {p.fio} ({p.kafedra})
            </span>
            <button onClick={() => del(p.id)}>Удалить</button>
          </li>
        ))}
      </ul>

      <div className="prepods-pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >Prev</button>

        {pages.map((p, i) => (
          <button
            key={i}
            onClick={() => typeof p === 'number' && setCurrentPage(p)}
            disabled={p === '...' || currentPage === p}
            className={currentPage === p ? 'active' : ''}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >Next</button>
      </div>

      {selectedPrepId && (
        <div className="reviews-container">
          <h3 className="reviews-header">
            Отзывы
            {averageGrates !== null && (
              <> — средний балл: <strong>{averageGrates}</strong></>
            )}
          </h3>

          {reviews.length > 0 ? (
            <ul className="reviews-list">
              {reviews.map(r => (
                <li key={r.id} className="reviews-list-item">
                  <p>{r.text}</p>
                  <span>[{r.dateReview}] Оценка: {r.grates}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Отзывы отсутствуют.</p>
          )}
        </div>
      )}
    </div>
  );
}