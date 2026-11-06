import { useEffect, useState } from 'react';
import { CONFIG } from '../config';
import { daysUntilEvent, eventParts } from '../lib/date';
import SectionTitle from './SectionTitle';
import { HeartIcon } from './Icons';

const WEEK = ['일', '월', '화', '수', '목', '금', '토'];

export default function Calendar() {
  const { y, m, d } = eventParts();
  const first = new Date(y, m - 1, 1).getDay();
  const days = new Date(y, m, 0).getDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);

  const [dd, setDd] = useState(() => daysUntilEvent());
  useEffect(() => {
    const t = window.setInterval(() => setDd(daysUntilEvent()), 60_000);
    return () => window.clearInterval(t);
  }, []);

  const name = CONFIG.baby.name;
  return (
    <section className="section section--calendar" aria-labelledby="t-cal">
      <SectionTitle en="BIRTHDAY DATE" ko={`${name}의 첫 번째 생일`} id="t-cal" />
      <p className="cal__when" data-reveal>
        {CONFIG.event.dateTextWithDay}
        <br />
        <span>{CONFIG.event.timeText}</span>
      </p>

      <div className="cal" data-reveal>
        <p className="cal__month">
          {y}. {String(m).padStart(2, '0')}
        </p>
        <table className="cal__grid">
          <caption className="sr-only">
            {y}년 {m}월 달력, {d}일 행사
          </caption>
          <thead>
            <tr>
              {WEEK.map((w, i) => (
                <th key={w} scope="col" className={i === 0 ? 'is-sun' : i === 6 ? 'is-sat' : ''}>
                  {w}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: cells.length / 7 }, (_, r) => (
              <tr key={r}>
                {cells.slice(r * 7, r * 7 + 7).map((c, i) => (
                  <td key={i} className={`${i === 0 ? 'is-sun' : ''}${c === d ? ' is-day' : ''}`}>
                    {c && (c === d ? (
                      <span className="cal__mark" aria-label={`${c}일 ${name}의 첫돌`}>
                        {c}
                      </span>
                    ) : (
                      c
                    ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="dday" data-reveal>
        {dd > 0 ? (
          <>
            {name}의 첫돌까지 <b>D-{dd}</b>
          </>
        ) : dd === 0 ? (
          <>
            <HeartIcon /> 오늘은 <b>{name}의 첫돌</b>입니다 <HeartIcon />
          </>
        ) : (
          <>{name}의 첫돌을 함께해 주셔서 감사합니다</>
        )}
      </p>
    </section>
  );
}
