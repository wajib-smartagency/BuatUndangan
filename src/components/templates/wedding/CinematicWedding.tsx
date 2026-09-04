"use client";
import React, { useState, useEffect, useRef } from 'react';
import { WeddingData, RsvpProps } from '@/types/invitation';

interface CinematicWeddingProps {
  data: WeddingData;
  rsvp?: RsvpProps;
  rsvpsList?: any[];
}

export default function CinematicWedding({ data, rsvp, rsvpsList = [] }: CinematicWeddingProps) {
  // We use inline CSS for the complex styles matching the HTML provided
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // States for scroll gallery
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Countdown logic
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

  // Scroll Gallery Intersection Observer
  const galleryStopsRef = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (!data.galeri || data.galeri.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const idx = Number(target.dataset.index);
          setActiveGalleryIndex(idx);
        }
      });
    }, { threshold: 0.6 });

    galleryStopsRef.current.forEach(stop => {
      if (stop) observer.observe(stop);
    });

    return () => observer.disconnect();
  }, [data.galeri]);

  // Scroll Reveal Observer
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

  return (
    <div className="cinematic-theme">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap');
        
        .cinematic-theme {
          --ink: #20261f;
          --ivory: #f6f2e9;
          --pine: #2f4538;
          --pine-deep: #1d2e24;
          --gold: #a9834f;
          --blush: #e6d6c6;
          --line: rgba(32,38,31,0.18);
          --shadow: 0 18px 40px rgba(29,46,36,0.18);
          
          background: var(--pine-deep);
          color: var(--ink);
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          -webkit-font-smoothing: antialiased;
        }

        .cinematic-frame {
          max-width: 480px;
          margin: 0 auto;
          background: var(--ivory);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }
        
        .cinematic-theme h1, .cinematic-theme h2, .cinematic-theme h3, .cinematic-theme .serif {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          color: var(--pine-deep);
          margin: 0;
        }
        
        .cinematic-theme .eyebrow {
          font-size: 0.72rem;
          letter-spacing: 0.28em;
          color: var(--gold);
          font-weight: 500;
        }

        .cinematic-theme section {
          padding: 4.2rem 1.9rem;
          text-align: center;
          border-bottom: 1px solid var(--line);
        }
        
        .cinematic-theme .reveal {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity .8s ease, transform .8s ease;
        }
        
        .cinematic-theme .reveal.in {
          opacity: 1;
          transform: none;
        }

        #hero {
          padding-top: 4.6rem;
          background: linear-gradient(180deg, #fbf9f3 0%, var(--ivory) 70%);
        }
        
        #hero h2 { font-size: 2.1rem; margin-top: 0.5rem; }
        .names { font-size: 2.9rem; line-height: 1.05; margin: 0.7rem 0; }
        .amp { color: var(--gold); font-style: italic; }
        .date-badge {
          display: inline-block;
          margin-top: 1.1rem;
          padding: 0.55rem 1.3rem;
          border: 1px solid var(--line);
          border-radius: 999px;
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          color: var(--pine);
        }

        .countdown {
          display: flex;
          justify-content: center;
          gap: 0.7rem;
          margin-top: 2.4rem;
        }
        .cd-box {
          background: var(--pine-deep);
          color: var(--ivory);
          width: 64px;
          padding: 0.75rem 0.2rem;
          border-radius: 12px;
        }
        .cd-box .num { font-family: 'Cormorant Garamond', serif; font-size: 1.7rem; display: block; }
        .cd-box .lbl { font-size: 0.6rem; letter-spacing: 0.1em; color: var(--blush); }

        .verse {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1.18rem;
          line-height: 1.7;
          color: var(--pine);
          max-width: 340px;
          margin: 0 auto;
        }
        .verse cite {
          display: block;
          margin-top: 0.7rem;
          font-style: normal;
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          color: var(--gold);
        }

        .couple-card { margin-top: 2.4rem; }
        .portrait {
          width: 150px; height: 150px;
          margin: 0 auto 1rem;
          border-radius: 50%;
          background: var(--blush);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          border: 1px solid var(--line);
        }
        .portrait img { width: 100%; height: 100%; object-fit: cover; }
        .couple-card h3 { font-size: 1.6rem; }
        .couple-card p { font-size: 0.85rem; line-height: 1.6; color: #4c574a; margin-top: 0.35rem; }
        
        .divider-row {
          display: flex; align-items: center; gap: 0.8rem;
          margin: 2.6rem 0;
        }
        .divider-row .line { flex: 1; height: 1px; background: var(--line); }
        .divider-row span { font-family: 'Cormorant Garamond', serif; font-style: italic; color: var(--gold); }

        .event-card {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 1.7rem 1.4rem;
          margin-top: 1.4rem;
          box-shadow: var(--shadow);
        }
        .event-card h3 { font-size: 1.5rem; }
        .event-card .when { margin-top: 0.5rem; font-size: 0.9rem; color: var(--pine); }
        .event-card .where { font-size: 0.85rem; color: #4c574a; margin-top: 0.2rem; }
        .maps-link {
          display: inline-block;
          margin-top: 1rem;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          color: var(--gold);
          border-bottom: 1px solid var(--gold);
          padding-bottom: 2px;
        }

        /* SCROLL PHOTO GALLERY */
        #gallery-scroll { padding: 0; border-bottom: none; }
        .sg-heading { padding: 4.2rem 1.9rem 1.6rem; text-align: center; }
        .scrollgallery { position: relative; }
        .sg-track { position: relative; }
        .sg-stop { height: 100vh; }
        .sg-sticky {
          position: sticky; top: 0; height: 100vh; overflow: hidden;
        }
        .sg-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover;
          opacity: 0;
          transform: scale(1.18) translateX(5%);
          transition: opacity 1.1s ease, transform 1.6s cubic-bezier(.22,.61,.36,1);
        }
        .sg-img.active { opacity: 1; transform: scale(1) translateX(0); }
        .sg-img.exit-left { transform: scale(1.06) translateX(-6%); opacity: 0; }
        
        .sg-sticky::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(0deg, rgba(17,26,20,0.65) 0%, rgba(17,26,20,0.05) 45%);
          pointer-events: none;
        }
        
        .sg-progress {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          z-index: 2; display: flex; flex-direction: column; gap: 7px;
        }
        .sg-progress span {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(246,242,233,0.4);
          transition: background .3s ease, height .3s ease;
        }
        .sg-progress span.active {
          background: var(--ivory); height: 16px; border-radius: 3px;
        }

        .envelope-box {
          background: var(--pine-deep); color: var(--ivory);
          border-radius: 20px; padding: 2.2rem 1.6rem; margin-top: 1.8rem;
        }
        .envelope-box p { font-size: 0.85rem; line-height: 1.6; color: var(--blush); }
        .bank-row {
          background: rgba(246,242,233,0.06);
          border: 1px solid rgba(246,242,233,0.18);
          border-radius: 12px; padding: 0.9rem 1rem; margin-top: 1rem;
          display: flex; justify-content: space-between; align-items: center; text-align: left;
        }
        .bank-row .num { font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; }
        .bank-row button {
          background: transparent; border: 1px solid var(--gold); color: var(--gold);
          padding: 0.4rem 0.8rem; border-radius: 999px; font-size: 0.7rem;
          letter-spacing: 0.08em; cursor: pointer; transition: all 0.3s ease;
        }
        .bank-row button.copied { background: var(--gold); color: var(--pine-deep); }

        .field { text-align: left; margin-top: 1.1rem; }
        .field label {
          display: block; font-size: 0.72rem; letter-spacing: 0.1em;
          color: var(--pine); margin-bottom: 0.4rem;
        }
        .field input, .field select, .field textarea {
          width: 100%; border: 1px solid var(--line); border-radius: 10px;
          padding: 0.7rem 0.85rem; font-family: inherit; font-size: 0.9rem;
          background: #fff; color: var(--ink);
        }
        .field textarea { resize: vertical; min-height: 80px; }
        .submit-btn {
          margin-top: 1.4rem; width: 100%; background: var(--pine);
          color: var(--ivory); border: none; padding: 0.9rem;
          border-radius: 999px; letter-spacing: 0.1em; font-size: 0.85rem; cursor: pointer;
        }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        
        .wish-list { margin-top: 1.6rem; text-align: left; }
        .wish { border-bottom: 1px solid var(--line); padding: 0.9rem 0; }
        .wish .who { font-size: 0.9rem; font-weight: 500; color: var(--pine-deep); }
        .wish .who span { font-weight: 300; color: var(--gold); font-size: 0.72rem; margin-left: 0.4rem; }
        .wish .msg { font-size: 0.85rem; color: #4c574a; margin-top: 0.25rem; line-height: 1.55; }

        footer {
          padding: 3rem 1.9rem 2.4rem; text-align: center;
          background: var(--pine-deep); color: var(--blush);
        }
        footer .serif { color: var(--ivory); font-size: 1.7rem; }
        footer p { font-size: 0.78rem; margin-top: 0.6rem; line-height: 1.6; }
      `}</style>

      <div className="cinematic-frame">
        {/* HERO */}
        <section id="hero" className="reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
          <div className="eyebrow">
            {new Date(data.acaraAkad.tanggal).toLocaleDateString('id-ID', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            }).toUpperCase()}
          </div>
          <h2>The Wedding Of</h2>
          <div className="names">{data.pria.namaPanggilan} <span className="amp">&amp;</span> {data.wanita.namaPanggilan}</div>
          <div className="date-badge">
            {new Date(data.acaraAkad.tanggal).toLocaleDateString('id-ID', {
              day: '2-digit', month: '2-digit', year: 'numeric'
            }).replace(/\//g, ' · ')}
          </div>

          <div className="countdown">
            <div className="cd-box"><span className="num">{padNum(timeLeft.days)}</span><span className="lbl">HARI</span></div>
            <div className="cd-box"><span className="num">{padNum(timeLeft.hours)}</span><span className="lbl">JAM</span></div>
            <div className="cd-box"><span className="num">{padNum(timeLeft.minutes)}</span><span className="lbl">MENIT</span></div>
            <div className="cd-box"><span className="num">{padNum(timeLeft.seconds)}</span><span className="lbl">DETIK</span></div>
          </div>
        </section>

        {/* VERSE */}
        <section className="reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
          <p className="verse">
            "{data.kutipan}"
            {data.sumberKutipan && <cite>{data.sumberKutipan}</cite>}
          </p>
        </section>

        {/* COUPLE */}
        <section className="reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
          <div className="eyebrow">MEMPELAI</div>
          <div className="couple-card">
            <div className="portrait">
              {data.wanita.foto ? <img src={data.wanita.foto} alt={data.wanita.namaLengkap} /> : "Foto Mempelai"}
            </div>
            <h3>{data.wanita.namaLengkap}</h3>
            <p>{data.wanita.namaBapak && data.wanita.namaIbu ? `Putri dari Bapak ${data.wanita.namaBapak} & Ibu ${data.wanita.namaIbu}` : ''}</p>
          </div>

          <div className="divider-row"><div className="line"></div><span>&amp;</span><div className="line"></div></div>

          <div className="couple-card">
            <div className="portrait">
              {data.pria.foto ? <img src={data.pria.foto} alt={data.pria.namaLengkap} /> : "Foto Mempelai"}
            </div>
            <h3>{data.pria.namaLengkap}</h3>
            <p>{data.pria.namaBapak && data.pria.namaIbu ? `Putra dari Bapak ${data.pria.namaBapak} & Ibu ${data.pria.namaIbu}` : ''}</p>
          </div>
        </section>

        {/* EVENTS */}
        <section className="reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
          <div className="eyebrow">RANGKAIAN ACARA</div>
          <div className="event-card">
            <h3>{data.acaraAkad.nama}</h3>
            <div className="when">
              {new Date(data.acaraAkad.tanggal).toLocaleDateString('id-ID', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
              })} · {data.acaraAkad.waktuMulai} WIB
            </div>
            <div className="where">{data.acaraAkad.lokasi}</div>
            {data.acaraAkad.linkGoogleMaps && (
              <a className="maps-link" href={data.acaraAkad.linkGoogleMaps} target="_blank" rel="noreferrer">Buka Google Maps</a>
            )}
          </div>
          <div className="event-card">
            <h3>{data.acaraResepsi.nama}</h3>
            <div className="when">
              {new Date(data.acaraResepsi.tanggal).toLocaleDateString('id-ID', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
              })} · {data.acaraResepsi.waktuMulai} WIB
            </div>
            <div className="where">{data.acaraResepsi.lokasi}</div>
            {data.acaraResepsi.linkGoogleMaps && (
              <a className="maps-link" href={data.acaraResepsi.linkGoogleMaps} target="_blank" rel="noreferrer">Buka Google Maps</a>
            )}
          </div>
        </section>

        {/* GALLERY SCROLL */}
        {(data.galeri || []).length > 0 && (
          <section id="gallery-scroll">
            <div className="sg-heading reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
              <div className="eyebrow">MOMEN KAMI</div>
              <h2 style={{ marginTop: '0.4rem', fontSize: '1.6rem' }}>Terus scroll untuk lihat efeknya</h2>
            </div>

            <div className="scrollgallery">
              <div className="sg-track">
                {(data.galeri || []).map((_, idx) => (
                  <div key={idx} className="sg-stop" data-index={idx} ref={(el) => { if(el) galleryStopsRef.current[idx] = el; }}></div>
                ))}
              </div>

              <div className="sg-sticky">
                {(data.galeri || []).map((url, idx) => (
                  <img 
                    key={idx}
                    className={`sg-img ${activeGalleryIndex === idx ? 'active' : activeGalleryIndex > idx ? 'exit-left' : ''}`}
                    src={url} 
                    alt={`Gallery ${idx}`} 
                  />
                ))}

                <div className="sg-progress">
                  {(data.galeri || []).map((_, idx) => (
                    <span key={idx} className={activeGalleryIndex === idx ? 'active' : ''}></span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* GIFTS */}
        <section className="reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
          <div className="eyebrow">AMPLOP DIGITAL</div>
          <div className="envelope-box">
            <h3 style={{ color: 'var(--ivory)' }}>Tanda Kasih</h3>
            <p>Doa restu Anda adalah karunia terbesar bagi kami. Jika ingin memberi tanda kasih secara cashless, dapat melalui rekening berikut.</p>
            
            {(data.rekening || []).map((rek, idx) => (
              <div key={idx} className="bank-row">
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.08em', color: 'var(--blush)' }}>{rek.namaBank} — a.n {rek.atasNama}</div>
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
            <div className="eyebrow">KONFIRMASI KEHADIRAN</div>
            {!rsvp.hasSubmitted ? (
              <form onSubmit={rsvp.onSubmit}>
                <div className="field">
                  <label>Nama Lengkap</label>
                  <input type="text" value={rsvp.name} onChange={(e) => rsvp.onNameChange(e.target.value)} placeholder="Nama Anda" required />
                </div>
                <div className="field">
                  <label>Status Kehadiran</label>
                  <select value={rsvp.status} onChange={(e) => rsvp.onStatusChange(e.target.value)}>
                    <option value="hadir">Hadir</option>
                    <option value="tidak hadir">Tidak Hadir</option>
                  </select>
                </div>
                <div className="field">
                  <label>Ucapan &amp; Doa</label>
                  <textarea value={rsvp.message} onChange={(e) => rsvp.onMessageChange(e.target.value)} placeholder="Tulis ucapan dan doa" required></textarea>
                </div>
                <button type="submit" disabled={rsvp.isSubmitting} className="submit-btn">
                  {rsvp.isSubmitting ? 'Mengirim...' : 'Kirim Ucapan'}
                </button>
              </form>
            ) : (
              <div className="envelope-box" style={{ marginTop: '1rem', background: '#e6d6c6', color: '#1d2e24' }}>
                Terima kasih atas ucapan dan doa restunya.
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
          <div className="serif">{data.pria.namaPanggilan} &amp; {data.wanita.namaPanggilan}</div>
          <p>Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.</p>
        </footer>
      </div>
    </div>
  );
}
