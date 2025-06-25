import requests
from bs4 import BeautifulSoup
import csv
import time

BASE_URL = 'https://ssau.ru/staff'
PARAMS = {'letter': '0'}

def scrape_page(page):
    PARAMS['page'] = page
    resp = requests.get(BASE_URL, params=PARAMS)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, 'html.parser')
    data = []
    for li in soup.select('li.list-group-item.list-group-item-action'):
        # 1) ФИО — текст первой ссылки внутри <li>
        name_tag = li.find('a', href=lambda href: href and '/staff/' in href)
        name = name_tag.get_text(strip=True) if name_tag else ''

        # 2) Направление — может быть в <a> или в <span> внутри <div class="mt-2">
        dept_tag = li.select_one(
            'div.mt-2 > a.text-dark.d-block,'   # если это ссылка
            'div.mt-2 > span.text-dark.d-block'  # или span
        )
        dept = dept_tag.get_text(strip=True) if dept_tag else ''

        if name:
            data.append((name, dept))
    return data

def main():
    with open('ssau_staff.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['ФИО', 'Направление'])
        for p in range(1, 124):
            print(f'Парсю страницу {p}/123 …')
            rows = scrape_page(p)
            writer.writerows(rows)
            time.sleep(0.5)  # пауза, чтобы не перегружать сервер
    print('Готово: файлы сохранены в ssau_staff1.csv')

if __name__ == '__main__':
    main()
