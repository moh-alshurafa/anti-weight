import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Activity, Brain, ArrowLeft, Stethoscope, Syringe, MessageSquare, Star, ChevronDown, ChevronUp, Clock, HelpCircle } from 'lucide-react';
import './App.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flowResult, setFlowResult] = useState(null); // 'A' or 'B'
  
  const [openFaq, setOpenFaq] = useState(null);

  // --- Modal Logic ---
  const questions = [
    {
      id: 'age',
      title: 'ما هي فئتك العمرية؟',
      options: [
        { label: 'أقل من 18 سنة', value: 'under_18' },
        { label: '18 إلى 65 سنة', value: '18_65' },
        { label: 'أكثر من 65 سنة', value: 'over_65' }
      ]
    },
    {
      id: 'bmi',
      title: 'كيف تصف مؤشر كتلة جسمك (BMI) أو وزنك الحالي؟',
      options: [
        { label: 'وزن طبيعي أو زيادة طفيفة (أقل من 27)', value: 'under_27' },
        { label: 'زيادة وزن ملحوظة (27 إلى 30)', value: '27_30' },
        { label: 'سمنة (أكثر من 30)', value: 'over_30' }
      ]
    },
    {
      id: 'conditions',
      title: 'هل تعاني من أي من الأمراض المزمنة التالية؟',
      options: [
        { label: 'لا أعاني من أمراض مزمنة', value: 'none' },
        { label: 'السكري من النوع الثاني', value: 'diabetes' },
        { label: 'ارتفاع ضغط الدم', value: 'hypertension' },
        { label: 'أمراض القلب أو غيرها', value: 'other' }
      ]
    },
    {
      id: 'prior_glp1',
      title: 'هل استخدمت أدوية إنقاص الوزن (مثل إبر GLP-1) سابقاً؟',
      options: [
        { label: 'نعم، استخدمتها حالياً أو سابقاً', value: 'yes' },
        { label: 'لا، لم أستخدمها قط', value: 'no' }
      ]
    },
    {
      id: 'past_attempts',
      title: 'ما هي المحاولات السابقة لإنقاص الوزن التي جربتها؟',
      options: [
        { label: 'حميات غذائية فقط', value: 'diet' },
        { label: 'رياضة وتغيير نمط الحياة', value: 'exercise' },
        { label: 'برامج مدفوعة', value: 'programs' },
        { label: 'عمليات جراحية (تكميم، تحويل مسار)', value: 'surgery' },
        { label: 'لم أقم بمحاولات جدية', value: 'none' }
      ]
    }
  ];

  const handleOptionSelect = (qId, val) => {
    setAnswers({ ...answers, [qId]: val });
    
    // Auto advance
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        evaluateEligibility({ ...answers, [qId]: val });
      }
    }, 400);
  };

  const evaluateEligibility = (finalAnswers) => {
    let result = 'B';
    
    // Flow A condition: Age 18-65 and (BMI > 30 OR (BMI 27-30 and has condition))
    if (finalAnswers.age === '18_65') {
      if (finalAnswers.bmi === 'over_30') {
        result = 'A';
      } else if (finalAnswers.bmi === '27_30' && finalAnswers.conditions !== 'none') {
        result = 'A';
      }
    }
    
    setFlowResult(result);
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setCurrentStep(0);
      setAnswers({});
      setFlowResult(null);
    }, 300);
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="app-header">
        <div className="container header-content">
          <a href="#" className="logo">مُعافى</a>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            تحقق من أهليتك
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="section hero">
        <div className="shape-1" />
        <div className="container grid-2">
          <motion.div 
            className="hero-text"
            initial="hidden" animate="visible" variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="badge mb-1 text-teal" style={{ fontWeight: 800, letterSpacing: '0.05em' }}>
              منصة الطبي الطبية
            </motion.div>
            <motion.h1 variants={fadeUp} className="mb-2">
              السمنة مشكلة طبية،<br/> وليست ضعف إرادة.
            </motion.h1>
            <motion.p variants={fadeUp} className="large mb-3" style={{ color: 'var(--neutral-600)' }}>
              احصل على خطة علاجية متكاملة تحت إشراف طبي مع خيارات أدوية GLP-1، دعم غذائي، وتحاليل مخبرية. لتصل لوزنك المثالي بطريقة علمية آمنة.
            </motion.p>
            <motion.div variants={fadeUp} style={{ marginTop: '10px' }}>
              <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ fontSize: '1.25rem', padding: '1.25rem 2.5rem' }}>
                ابدأ التقييم الطبي مجاناً
                <ArrowLeft size={20} />
              </button>
              <p className="caption mt-1" style={{ color: 'var(--teal-600)', marginTop: '12px', marginBottom: '12px' }}>
                *الاستشارة الأولى مجانية كلياً للمؤهلين
              </p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="hero-image-wrapper"
            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
          >
            <img src={`${import.meta.env.BASE_URL}belly-measurement.png`} alt="Person measuring waist with tape" />
          </motion.div>
        </div>
      </section>

      {/* REFRAME SECTION */}
      <section className="section bg-surface">
        <div className="container text-center" style={{ maxWidth: '800px' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
            <motion.div variants={fadeUp} className="icon-box mx-auto" style={{ margin: '0 auto 1.5rem', background: 'var(--teal-800)', color: 'var(--lime-500)' }}>
              <Brain size={32} />
            </motion.div>
            <motion.h2 variants={fadeUp}>توقف عن لوم نفسك</motion.h2>
            <motion.p variants={fadeUp} className="large mb-2" style={{ color: 'var(--teal-800)' }}>
              تصنف منظمة الصحة العالمية والجهات الطبية العالمية السمنة كمرض مزمن يحتاج إلى تدخل طبي مبني على العلم، وليس مجرد اتباع حميات أثبتت فشلها المتكرر. "مُعافى" يعالج الجذر البيولوجي للوزن.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container grid-2">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          >
            <motion.h2 variants={fadeUp} className="mb-3">كيف يعمل برنامج مُعافى؟</motion.h2>
            <div className="steps-list">
              {[
                { title: 'تقييم الأهلية', desc: 'املأ الاستبيان الطبي السريع لتحديد ما إذا كانت حالتك تستدعي استخدام أدوية أو برامج إنقاص الوزن.' },
                { title: 'استشارة طبيب متخصص', desc: 'سيقوم الطبيب بمراجعة التحاليل ووصف دواء GLP-1 المناسب وتحديد خطة العلاج خطوة بخطوة.' },
                { title: 'دعم غذائي مستمر', desc: 'جلسات نصف شهرية مع أخصائي التغذية لتعديل العادات وبناء نمط حياة مستدام.' },
                { title: 'توصيل الأدوية للمنزل', desc: 'استلم أدويتك الموصوفة شهرياً حتى باب بيتك دون مجهود إضافي.' }
              ].map((step, idx) => (
                <motion.div variants={fadeUp} className="step-item" key={idx}>
                  <div className="step-number">{idx + 1}</div>
                  <div>
                    <h3 className="mb-1">{step.title}</h3>
                    <p style={{ color: 'var(--neutral-600)' }}>{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="hero-image-wrapper"
          >
            <img src={`${import.meta.env.BASE_URL}attractive-smiling-sportsman-warming-up-his-body-outdoor-training.png`} alt="Smiling man warming up outdoors" />
          </motion.div>
        </div>
      </section>

      {/* FEATURES / EVERYTHING INCLUDED */}
      <section className="section bg-surface">
        <div className="container">
          <motion.div className="text-center mb-4" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2>كل ما تحتاجه في اشتراك واحد</h2>
            <p className="large" style={{ color: 'var(--teal-700)' }}>برنامج طبي متكامل يصمم خصيصاً لك</p>
          </motion.div>
          
          <motion.div className="grid-3" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
            <motion.div variants={fadeUp} className="card">
              <div className="icon-box"><Stethoscope size={32} /></div>
              <h3 className="mb-1">إشراف طبي دقيق</h3>
              <p style={{ color: 'var(--neutral-600)' }}>متابعة شهرية مع طبيبك الخاص لضبط الجرعات والتأكد من استجابة جسمك للعلاج بأمان.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="card">
              <div className="icon-box"><Syringe size={32} /></div>
              <h3 className="mb-1">أدوية GLP-1</h3>
              <p style={{ color: 'var(--neutral-600)' }}>أدوية أثبتت فعاليتها عالمياً تساعد في تقليل الشهية وتنظيم مستوى السكر في الدم للمؤهلين.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="card">
              <div className="icon-box"><Activity size={32} /></div>
              <h3 className="mb-1">تحاليل مخبرية</h3>
              <p style={{ color: 'var(--neutral-600)' }}>باقات تحاليل شاملة للدم والغدد لضمان اختيار العلاج الأنسب وتجنب أي مضاعفات.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TRUST */}
      <section className="section text-center">
        <div className="container" style={{ maxWidth: '800px' }}>
          <ShieldCheck size={48} color="var(--teal-600)" className="mx-auto mb-2" />
          <h2>مبني على أسس طبية عالمية</h2>
          <p className="large mb-2" style={{ color: 'var(--neutral-600)' }}>
            بروتوكولات "مُعافى" تتبع أحدث التوصيات المعتمدة من منظمة الصحة العالمية وهيئة الغذاء والدواء. نحن لسنا تطبيق حمية، بل عيادة إلكترونية متخصصة تقدم رعاية طبية حقيقية.
          </p>
        </div>
      </section>

      {/* ELIGIBILITY CTA (BOTTOM) */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div 
            className="card eligibility-box"
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <h2 className="mb-1" style={{ color: 'white' }}>هل أنت مؤهل للعلاج؟</h2>
            <p className="large mb-3" style={{ opacity: 0.9 }}>
              أجب عن 5 أسئلة في أقل من دقيقة لتعرف مدى أهليتك لخيارات العلاج الدوائي للوزن، واحصل على استشارة أولية مجانية من الطبيب للبدء.
            </p>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              ابدأ الاستبيان الآن
            </button>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-surface">
        <div className="container">
          <h2 className="text-center mb-4">الأسئلة الشائعة</h2>
          <div className="faq-list">
            {[
              { q: 'ما هي أدوية GLP-1؟', a: 'هي فئة من الأدوية التي تُوصف طبياً لعلاج السمنة والسكري. تعمل على تنظيم مستويات السكر في الدم، الإحساس بالشبع لفترات أطول، وتقليل الشهية.' },
              { q: 'هل الأدوية آمنة للجميع؟', a: 'الأدوية آمنة عندما تؤخذ تحت إشراف طبي دقيق للمؤهلين فقط. لذلك نبدأ بتقييم صحي شامل وتحاليل للتأكد من ملاءمتها لك دون أعراض جانبية خطيرة.' },
              { q: 'ماذا لو لم أكن مؤهلاً للأدوية؟', a: 'إذا لم تكن الأدوية مناسبة لك بعد التقييم، سيوصي فريقنا الطبي بخطة شاملة ترتكز على التغذية وتغيير نمط الحياة لدعمك في رحلتك.' }
            ].map((faq, idx) => (
              <div 
                key={idx} 
                className="faq-item" 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="faq-header">
                  <h3 style={{ margin: 0 }}>{faq.q}</h3>
                  {openFaq === idx ? <ChevronUp color="var(--teal-700)" /> : <ChevronDown color="var(--teal-500)" />}
                </div>
                <div className="faq-answer" style={{ maxHeight: openFaq === idx ? '200px' : '0', opacity: openFaq === idx ? 1 : 0, marginTop: openFaq === idx ? '1rem' : 0 }}>
                  <p style={{ color: 'var(--neutral-600)' }}>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container text-center">
          <h2 style={{ color: 'var(--white)' }}>مُعافى</h2>
          <p className="mb-2">خطوتك الأولى نحو حياة أكثر صحة تحت إشراف طبي متخصص.</p>
          <p className="caption" style={{ color: 'rgba(255,255,255,0.5)' }}>© 2025 Altibbi. جميع الحقوق محفوظة.</p>
        </div>
      </footer>

      {/* QUESTIONNAIRE MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-container"
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <button className="btn-close" onClick={resetModal}>✕</button>
              
              {!flowResult ? (
                <>
                  <div className="modal-header">
                    <div className="progress-bar-bg mb-0" style={{ marginBottom: 0 }}>
                      <div className="progress-bar-fill" style={{ width: `${(currentStep / questions.length) * 100}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="modal-body">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{questions[currentStep].title}</h2>
                        
                        <div className="radio-group-modern" style={{ marginTop: '1rem' }}>
                          {questions[currentStep].options.map((opt) => (
                            <div 
                              key={opt.value} 
                              className={`radio-option ${answers[questions[currentStep].id] === opt.value ? 'selected' : ''}`}
                              onClick={() => handleOptionSelect(questions[currentStep].id, opt.value)}
                            >
                              <span style={{ fontSize: '1.125rem' }}>{opt.label}</span>
                              <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--teal-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {answers[questions[currentStep].id] === opt.value && (
                                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--teal-700)' }} />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="modal-body text-center" style={{ padding: '3rem 2rem' }}>
                  {flowResult === 'A' ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                      <div className="icon-box mx-auto" style={{ background: 'var(--lime-500)', color: 'var(--teal-950)' }}>
                        <CheckCircle2 size={40} />
                      </div>
                      <h2 style={{ color: 'var(--teal-800)' }}>مبارك! أنت مؤهل مبدئياً</h2>
                      <p className="large mb-2" style={{ color: 'var(--neutral-600)' }}>
                        بناءً على إجاباتك، الحالات المشابهة تستفيد بشكل كبير من أدوية GLP-1 ضمن خطة طبية. خطوتك التالية هي استشارة طبيب مجانية للتأكيد والبدء.
                      </p>
                      <button className="btn btn-primary" style={{ width: '100%' }}>
                        احجز استشارتك المجانية الآن
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                      <div className="icon-box mx-auto" style={{ background: 'var(--teal-surface)', color: 'var(--teal-600)' }}>
                        <Clock size={40} />
                      </div>
                      <h2 style={{ color: 'var(--teal-800)' }}>شكراً لاختيارك مُعافى</h2>
                      <p className="large mb-2" style={{ color: 'var(--neutral-600)' }}>
                        يحتاج فريقنا الطبي لمراجعة إجاباتك بعناية لتحديد الخطة الأنسب والأكثر أماناً لحالتك. سنتواصل معك هاتفياً خلال 48 ساعة.
                      </p>
                      <button className="btn btn-secondary" style={{ width: '100%' }} onClick={resetModal}>
                        العودة للصفحة الرئيسية
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
