"use client";
import React, { useState, useEffect, useRef } from 'react';
import { WeddingData, RsvpProps } from '@/types/invitation';

interface EditorialWeddingProps {
  data: WeddingData;
  rsvp?: RsvpProps;
  rsvpsList?: any[];
}

export default function EditorialWedding({ data, rsvp, rsvpsList = [] }: EditorialWeddingProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const eventDate = new Date(data.acaraAkad.tanggal).getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = Math.max(0, eventDate - now);
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [data.acaraAkad.tanggal]);

  const revealRefs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });

    revealRefs.current.forEach(el => {
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const copyToClipboard = (text: string, e: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(text);
    const btn = e.currentTarget;
    const original = btn.textContent;
    btn.textContent = 'Tersalin';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 1800);
  };

  const padNum = (num: number) => String(num).padStart(2, '0');

  // Swipe gallery logic
  const swTrackRef = useRef<HTMLDivElement>(null);
  const [swActive, setSwActive] = useState(0);

  useEffect(() => {
    const track = swTrackRef.current;
    if (!track) return;
    const onScroll = () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let closestIdx = 0;
      let minDiff = Infinity;
      Array.from(track.children).forEach((child, idx) => {
        const el = child as HTMLElement;
        const childCenter = el.offsetLeft + el.clientWidth / 2;
        const diff = Math.abs(center - childCenter);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });
      setSwActive(closestIdx);
    };
    track.addEventListener('scroll', onScroll);
    setTimeout(onScroll, 100);
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="editorial-theme">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        
        .editorial-theme {
          --paper: #f2eee7;
          --ink: #17140f;
          --rust: #9c4b2e;
          --steel: #7c7566;
          --line: rgba(23,21,18,0.14);
          
          background: var(--ink);
          color: var(--ink);
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 400;
          -webkit-font-smoothing: antialiased;
        }

        .ed-frame {
          max-width: 480px;
          margin: 0 auto;
          background: var(--paper);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }
        
        .editorial-theme .display, .editorial-theme h1, .editorial-theme h2, .editorial-theme h3 {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          margin: 0;
          color: var(--ink);
        }
        
        .editorial-theme .eyebrow {
          font-size: 0.68rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--rust);
          font-weight: 600;
        }

        .editorial-theme .num-mark {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 0.95rem;
          color: var(--steel);
        }

        .editorial-theme section {
          padding: 4rem 1.9rem;
          border-bottom: 1px solid var(--line);
          text-align: center;
        }
        
        .editorial-theme .reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity .8s ease, transform .8s ease;
        }
        
        .editorial-theme .reveal.in {
          opacity: 1;
          transform: none;
        }

        #hero { padding-top: 4.4rem; background: var(--paper); }
        #hero .names { font-size: 3.1rem; line-height: 1; margin-top: 0.6rem; font-style: italic; }
        #hero .names em { font-style: normal; color: var(--rust); }
        .rule { height: 1px; background: var(--ink); width: 46px; margin: 1.3rem auto; }
        .hero-date { font-size: 0.85rem; letter-spacing: 0.1em; color: var(--steel); }

        .flipwrap { display: flex; gap: 0.6rem; margin-top: 2.2rem; justify-content: center; }
        .flip-unit { text-align: left; }
        .flip-face-outer {
          background: var(--ink); color: var(--paper);
          width: 64px; height: 56px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Fraunces', serif; font-size: 1.5rem;
        }
        .flip-lbl { font-size: 0.62rem; letter-spacing: 0.1em; color: var(--steel); margin-top: 0.5rem; text-transform: uppercase; display: block; text-align: center; }

        .verse {
          font-family: 'Fraunces', serif; font-style: italic; font-size: 1.15rem;
          line-height: 1.7; color: var(--ink); text-align: left;
          border-left: 2px solid var(--rust); padding-left: 1rem;
        }
        .verse cite { display: block; margin-top: 0.6rem; font-style: normal; font-size: 0.7rem; letter-spacing: 0.12em; color: var(--steel); }

        .couple-row { display: flex; flex-direction: column; gap: 2.2rem; margin-top: 1.6rem; }
        .couple-item { display: flex; gap: 1.1rem; align-items: center; text-align: left; }
        .couple-item .portrait {
          width: 88px; height: 88px; border-radius: 6px; flex: none;
          background: linear-gradient(160deg,#d8d0c1,var(--steel));
          display: flex; align-items: center; justify-content: center;
          color: var(--paper); font-size: 0.6rem; overflow: hidden;
        }
        .couple-item .portrait img { width: 100%; height: 100%; object-fit: cover; }
        .couple-item h3 { font-size: 1.4rem; font-style: italic; }
        .couple-item p { font-size: 0.8rem; color: var(--steel); margin-top: 0.3rem; line-height: 1.5; }

        .event-row { margin-top: 1.6rem; display: flex; gap: 1rem; text-align: left; }
        .event-row .num-mark { flex: none; width: 28px; padding-top: 0.15rem; }
        .event-row h3 { font-size: 1.4rem; font-style: italic; }
        .event-row .when { font-size: 0.85rem; margin-top: 0.3rem; color: var(--ink); }
        .event-row .where { font-size: 0.8rem; color: var(--steel); margin-top: 0.15rem; }
        .event-row .maps-link { display: inline-block; margin-top: 0.6rem; font-size: 0.72rem; letter-spacing: 0.08em; color: var(--rust); border-bottom: 1px solid var(--rust); padding-bottom: 2px; }

        #swipe-gallery { padding-left: 0; padding-right: 0; }
        .sw-heading { padding: 0 1.9rem; text-align: left; }
        .sw-track {
          margin-top: 1.8rem; display: flex; gap: 14px; overflow-x: auto;
          scroll-snap-type: x mandatory; padding: 0 1.9rem 1.4rem;
          scrollbar-width: none;
        }
        .sw-track::-webkit-scrollbar { display: none; }
        .sw-card {
          flex: none; width: 72%; scroll-snap-align: center; aspect-ratio: 3/4;
          border-radius: 10px; overflow: hidden; transform: scale(0.86);
          opacity: 0.55; transition: transform .3s ease, opacity .3s ease;
        }
        .sw-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .sw-card.center { transform: scale(1); opacity: 1; }
        .sw-hint { padding: 0 1.9rem; font-size: 0.72rem; color: var(--steel); letter-spacing: 0.08em; margin-top: 0.4rem; text-align: left; }

        .env-box { background: var(--ink); color: var(--paper); border-radius: 14px; padding: 2rem 1.5rem; margin-top: 1.6rem; text-align: left; }
        .env-box h3 { color: var(--paper); font-style: italic; font-size: 1.5rem; }
        .env-box p { font-size: 0.85rem; line-height: 1.6; color: rgba(242,238,231,0.75); }
        .bank-row { background: rgba(242,238,231,0.06); border: 1px solid rgba(242,238,231,0.18); border-radius: 10px; padding: 0.85rem 1rem; margin-top: 0.9rem; display: flex; justify-content: space-between; align-items: center; }
        .bank-row .num { font-family: 'Fraunces',serif; font-size: 1.1rem; }
        .bank-row button { background: none; border: 1px solid var(--rust); color: var(--rust); padding: 0.35rem 0.75rem; border-radius: 999px; font-size: 0.68rem; letter-spacing: 0.06em; cursor: pointer; transition: all 0.3s ease;}
        .bank-row button.copied { background: var(--rust); color: var(--paper); }

        .field { text-align: left; margin-top: 1rem; }
        .field label { display: block; font-size: 0.7rem; letter-spacing: 0.08em; color: var(--steel); margin-bottom: 0.35rem; text-transform: uppercase; }
        .field input, .field select, .field textarea {
          width: 100%; border: none; border-bottom: 1px solid var(--line);
          padding: 0.6rem 0.1rem; font-family: inherit; font-size: 0.9rem; background: transparent; color: var(--ink); outline: none;
        }
        .field textarea { resize: vertical; min-height: 70px; }
        .submit-btn { margin-top: 1.3rem; width: 100%; background: var(--rust); color: var(--paper); border: none; padding: 0.85rem; border-radius: 4px; letter-spacing: 0.1em; font-size: 0.8rem; text-transform: uppercase; cursor: pointer; }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        
        .wish-list { margin-top: 1.6rem; text-align: left; }
        .wish { border-bottom: 1px solid var(--line); padding: 0.9rem 0; }
        .wish .who { font-size: 0.9rem; font-weight: 600; color: var(--ink); }
        .wish .who span { font-weight: 400; color: var(--steel); font-size: 0.72rem; margin-left: 0.4rem; font-style: italic;}
        .wish .msg { font-size: 0.85rem; color: var(--steel); margin-top: 0.3rem; line-height: 1.55; }

        footer { padding: 3rem 1.9rem 2.4rem; text-align: center; background: var(--ink); color: var(--steel); }
        footer .display { color: var(--paper); font-size: 1.6rem; font-style: italic; }
        footer p { font-size: 0.78rem; margin-top: 0.6rem; line-height: 1.6; }
      `}</style>

      <div className="ed-frame">
        {/* HERO */}
        <section id="hero" className="reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
          <div className="eyebrow">The Wedding Of</div>
          <div className="names">{data.pria.namaPanggilan} <em>&amp;</em> {data.wanita.namaPanggilan}</div>
          <div className="rule"></div>
          <div className="hero-date">
            {new Date(data.acaraAkad.tanggal).toLocaleDateString('id-ID', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            }).toUpperCase()}
          </div>
          
          <div className="flipwrap">
            <div className="flip-unit"><div className="flip-face-outer">{padNum(timeLeft.days)}</div><span className="flip-lbl">Hari</span></div>
            <div className="flip-unit"><div className="flip-face-outer">{padNum(timeLeft.hours)}</div><span className="flip-lbl">Jam</span></div>
            <div className="flip-unit"><div className="flip-face-outer">{padNum(timeLeft.minutes)}</div><span className="flip-lbl">Menit</span></div>
            <div className="flip-unit"><div className="flip-face-outer">{padNum(timeLeft.seconds)}</div><span className="flip-lbl">Detik</span></div>
          </div>
        </section>

        {/* VERSE */}
        <section className="reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
          <p className="verse">
            "{data.kutipan}"
            {data.sumberKutipan && <cite>{data.sumberKutipan}</cite>}
          </p>
        </section>

        {/* MEMPELAI */}
        <section className="reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
          <div className="eyebrow" style={{textAlign: 'left'}}>Sang Mempelai</div>
          <div className="couple-row">
            <div className="couple-item">
              <div className="portrait">
                {data.wanita.foto ? <img src={data.wanita.foto} alt={data.wanita.namaLengkap}/> : 'Foto'}
              </div>
              <div>
                <h3>{data.wanita.namaLengkap}</h3>
                <p>{data.wanita.namaBapak && data.wanita.namaIbu ? `Putri dari Bapak ${data.wanita.namaBapak} & Ibu ${data.wanita.namaIbu}` : ''}</p>
              </div>
            </div>
            
            <div className="couple-item">
              <div className="portrait">
                {data.pria.foto ? <img src={data.pria.foto} alt={data.pria.namaLengkap}/> : 'Foto'}
              </div>
              <div>
                <h3>{data.pria.namaLengkap}</h3>
                <p>{data.pria.namaBapak && data.pria.namaIbu ? `Putra dari Bapak ${data.pria.namaBapak} & Ibu ${data.pria.namaIbu}` : ''}</p>
              </div>
            </div>
          </div>
        </section>

        {/* EVENTS */}
        <section className="reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
          <div className="eyebrow" style={{textAlign: 'left'}}>Rangkaian Acara</div>
          
          <div className="event-row">
            <div className="num-mark">I</div>
            <div>
              <h3>{data.acaraAkad.nama}</h3>
              <div className="when">
                {new Date(data.acaraAkad.tanggal).toLocaleDateString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })} · {data.acaraAkad.waktuMulai} WIB
              </div>
              <div className="where">{data.acaraAkad.lokasi}</div>
              {data.acaraAkad.linkGoogleMaps && (
                <a className="maps-link" href={data.acaraAkad.linkGoogleMaps} target="_blank" rel="noreferrer">Peta Lokasi</a>
              )}
            </div>
          </div>

          <div className="event-row">
            <div className="num-mark">II</div>
            <div>
              <h3>{data.acaraResepsi.nama}</h3>
              <div className="when">
                {new Date(data.acaraResepsi.tanggal).toLocaleDateString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })} · {data.acaraResepsi.waktuMulai} WIB
              </div>
              <div className="where">{data.acaraResepsi.lokasi}</div>
              {data.acaraResepsi.linkGoogleMaps && (
                <a className="maps-link" href={data.acaraResepsi.linkGoogleMaps} target="_blank" rel="noreferrer">Peta Lokasi</a>
              )}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        {(data.galeri || []).length > 0 && (
          <section id="swipe-gallery">
            <div className="sw-heading reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
              <div className="eyebrow">Momen Bahagia</div>
            </div>
            
            <div className="sw-track" ref={swTrackRef}>
              {(data.galeri || []).map((url, idx) => (
                <div key={idx} className={`sw-card ${swActive === idx ? 'center' : ''}`}>
                  <img src={url} alt={`Gallery ${idx}`} />
                </div>
              ))}
            </div>
            <div className="sw-hint">Geser untuk melihat momen lainnya →</div>
          </section>
        )}

        {/* GIFTS */}
        <section className="reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
          <div className="eyebrow" style={{textAlign: 'left'}}>Tanda Kasih</div>
          <div className="env-box">
            <h3>Amplop Digital</h3>
            <p>Doa restu Anda adalah karunia terbesar bagi kami. Jika ingin memberi tanda kasih secara cashless, dapat melalui rekening berikut.</p>
            
            {(data.rekening || []).map((rek, idx) => (
              <div key={idx} className="bank-row">
                <div>
                  <div style={{fontSize: '0.7rem', letterSpacing: '0.08em', color: 'rgba(242,238,231,0.6)'}}>{rek.namaBank} — a.n {rek.atasNama}</div>
                  <div className="num">{rek.noRekening}</div>
                </div>
                <button onClick={(e) => copyToClipboard(rek.noRekening, e)}>Salin</button>
              </div>
            ))}
          </div>
        </section>

        {/* RSVP */}
        {rsvp && (
          <section className="reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
            <div className="eyebrow" style={{textAlign: 'left'}}>Konfirmasi Hadir</div>
            {!rsvp.hasSubmitted ? (
              <form onSubmit={rsvp.onSubmit} style={{marginTop: '1.4rem'}}>
                <div className="field">
                  <label>Nama Lengkap</label>
                  <input type="text" value={rsvp.name} onChange={(e) => rsvp.onNameChange(e.target.value)} required />
                </div>
                <div className="field">
                  <label>Kehadiran</label>
                  <select value={rsvp.status} onChange={(e) => rsvp.onStatusChange(e.target.value)}>
                    <option value="hadir">Hadir</option>
                    <option value="tidak hadir">Tidak Hadir</option>
                  </select>
                </div>
                <div className="field">
                  <label>Pesan</label>
                  <textarea value={rsvp.message} onChange={(e) => rsvp.onMessageChange(e.target.value)} required></textarea>
                </div>
                <button type="submit" disabled={rsvp.isSubmitting} className="submit-btn">
                  {rsvp.isSubmitting ? 'Mengirim...' : 'Kirim'}
                </button>
              </form>
            ) : (
              <div className="env-box" style={{marginTop:'1.4rem', background:'#e6d6c6', color:'#17140f'}}>
                <h3 style={{color:'#17140f'}}>Terima Kasih</h3>
                <p style={{color:'#7c7566'}}>Ucapan dan doa restu Anda telah kami terima.</p>
              </div>
            )}

            <div className="wish-list">
              {rsvpsList.map((r, idx) => (
                <div key={idx} className="wish">
                  <div className="who">{r.guests?.name} <span>{r.status}</span></div>
                  <div className="msg">{r.message}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className="reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
          <div className="display">{data.pria.namaPanggilan} &amp; {data.wanita.namaPanggilan}</div>
          <p>Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.</p>
        </footer>
      </div>
    </div>
  );
}
