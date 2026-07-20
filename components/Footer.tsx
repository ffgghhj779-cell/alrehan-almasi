import Image from 'next/image';
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-text-dark text-white pt-24 pb-12 border-t-4 border-orange-accent" id="تواصل معنا">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden luxury-shadow ring-2 ring-orange-accent/30">
                <Image src="/logo.png" alt="شعار الرهان الماسي" fill quality={100} className="object-cover" />
              </div>
              <span className="font-cairo font-bold text-3xl text-white">الرهان الماسي</span>
            </div>
            <p className="text-white/70 text-base leading-relaxed mb-8 font-tajawal">
              مؤسسة الرهان الماسي للدواجن — شريكك الموثوق لتوريد الدواجن المبردة والمجمدة
              والبيض واللحوم داخل المملكة العربية السعودية.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Linkedin, label: 'LinkedIn' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange-accent hover:-translate-y-1 transition-all duration-300"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:pr-12">
            <h3 className="font-cairo font-bold text-2xl mb-8 text-orange-accent">روابط سريعة</h3>
            <ul className="space-y-4">
              {['الرئيسية', 'الأقسام', 'من نحن', 'منتجاتنا', 'المعرض', 'المميزات'].map(
                (link) => (
                  <li key={link}>
                    <a
                      href={`/#${link}`}
                      className="text-white/80 hover:text-white hover:translate-x-[-8px] transition-all duration-300 flex items-center gap-2 font-semibold font-tajawal"
                    >
                      <span className="text-orange-accent text-xl leading-none">&larr;</span> {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-cairo font-bold text-2xl mb-8 text-orange-accent">تواصل معنا</h3>
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                  <MapPin className="text-green-accent" size={28} />
                </div>
                <div className="pt-1">
                  <h4 className="font-bold mb-2 text-lg font-cairo">الموقع</h4>
                  <p className="text-white/70 font-tajawal">
                    المملكة العربية السعودية
                    <br />
                    الرياض
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                  <Phone className="text-orange-accent" size={28} />
                </div>
                <div className="pt-1">
                  <h4 className="font-bold mb-2 text-lg font-cairo">الهاتف / واتساب</h4>
                  <a
                    href="tel:+966560706018"
                    className="text-white/70 font-tajawal block hover:text-white transition-colors"
                    dir="ltr"
                  >
                    +966 56 070 6018
                  </a>
                  <a
                    href="https://wa.me/966560706018"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 text-sm font-tajawal hover:text-green-300 transition-colors mt-1 block"
                  >
                    💬 تواصل عبر واتساب
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                  <Mail className="text-blue-primary" size={28} />
                </div>
                <div className="pt-1">
                  <h4 className="font-bold mb-2 text-lg font-cairo">البريد الإلكتروني</h4>
                  <p className="text-white/70 font-tajawal">info@alrehan-almasi.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm font-semibold font-tajawal" suppressHydrationWarning>
            © {new Date().getFullYear()} مؤسسة الرهان الماسي للدواجن. جميع الحقوق محفوظة.
          </p>
          <p className="text-white/40 text-xs font-tajawal">
            Al Rehan Almasi Poultry Est. — Kingdom of Saudi Arabia
          </p>
        </div>
      </div>
    </footer>
  );
}
