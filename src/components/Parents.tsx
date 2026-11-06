import { useCallback, useState } from 'react';
import { CONFIG } from '../config';
import { useToast } from '../lib/toast';
import Modal from './Modal';
import SmartImage from './SmartImage';
import { PhoneIcon, SmsIcon } from './Icons';

const show = (v: string) => v || '미정';
const digits = (p: string) => p.replace(/[^0-9+]/g, '');

export default function Parents() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const toast = useToast();
  const { dad, mom, photo } = CONFIG.parents;

  const people = [dad, mom];
  return (
    <section className="section section--parents" aria-label="부모님 소개">
      <div className="parents__photo" data-reveal>
        <SmartImage src={photo} alt={`${dad.label}와 ${mom.label}의 어릴 적 사진`} />
      </div>
      <p className="parents__names" data-reveal>
        <span>
          <span className="parents__role">{dad.label}</span> <b>{show(dad.name)}</b>
        </span>
        <span>
          <span className="parents__role">{mom.label}</span> <b>{show(mom.name)}</b>
        </span>
      </p>
      <div data-reveal>
        <button type="button" className="btn btn--outline" onClick={() => setOpen(true)}>
          연락하기
        </button>
      </div>

      <Modal open={open} onClose={close} title="연락하기">
        <ul className="contact-list">
          {people.map((p) => {
            const num = digits(p.phone);
            const guard = (e: React.MouseEvent) => {
              if (!num) {
                e.preventDefault();
                toast('연락처가 아직 등록되지 않았어요.');
              }
            };
            return (
              <li key={p.label} className="contact-row">
                <div className="contact-row__who">
                  <span className="contact-row__role">{p.label}</span>
                  <b>{show(p.name)}</b>
                </div>
                <div className="contact-row__acts">
                  <a className="icon-btn" href={num ? `tel:${num}` : '#'} onClick={guard} aria-label={`${p.label}에게 전화하기`}>
                    <PhoneIcon />
                    <span>전화</span>
                  </a>
                  <a className="icon-btn" href={num ? `sms:${num}` : '#'} onClick={guard} aria-label={`${p.label}에게 문자 보내기`}>
                    <SmsIcon />
                    <span>문자</span>
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </Modal>
    </section>
  );
}
