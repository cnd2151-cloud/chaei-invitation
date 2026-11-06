import { useState } from 'react';
import { CONFIG } from '../config';
import { copyText } from '../lib/clipboard';
import { useToast } from '../lib/toast';
import SectionTitle from './SectionTitle';
import { ChevronIcon, CopyIcon } from './Icons';

const show = (v: string) => v || '미정';

export default function Accounts() {
  const toast = useToast();
  const [open, setOpen] = useState<number | null>(null);

  const copy = async (bank: string, num: string) => {
    if (!num) return toast('계좌번호가 아직 등록되지 않았어요.');
    const ok = await copyText(`${bank} ${num}`.trim());
    toast(ok ? '계좌번호가 복사되었습니다.' : '복사에 실패했어요. 번호를 길게 눌러 복사해 주세요.');
  };

  return (
    <section className="section section--accounts" aria-labelledby="t-acc">
      <SectionTitle en="THANKS TO" ko="마음 전하는 곳" id="t-acc" />
      <p className="acc__notice" data-reveal>
        {CONFIG.texts.accountNotice}
      </p>
      <div className="acc" data-reveal>
        {CONFIG.accounts.map((a, i) => {
          const on = open === i;
          return (
            <div key={i} className={`acc__item${on ? ' is-open' : ''}`}>
              <button
                type="button"
                className="acc__head"
                aria-expanded={on}
                aria-controls={`acc-${i}`}
                onClick={() => setOpen(on ? null : i)}
              >
                <span>{a.group}</span>
                <ChevronIcon />
              </button>
              <div className="acc__panel" id={`acc-${i}`} role="region" aria-label={a.group}>
                <div className="acc__panel-in">
                  <div className="acc__row">
                    <div className="acc__meta">
                      <p className="acc__bank">
                        {show(a.bank)} <span>|</span> {show(a.holder)}
                      </p>
                      <p className="acc__num">{show(a.number)}</p>
                    </div>
                    <button type="button" className="chip" onClick={() => copy(a.bank, a.number)} tabIndex={on ? 0 : -1}>
                      <CopyIcon /> 복사
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
