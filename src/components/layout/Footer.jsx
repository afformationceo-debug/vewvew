import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Instagram, Youtube, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  about: [
    { key: 'about_us', path: '/about' },
    { key: 'how_it_works', path: '/how-it-works' },
    { key: 'partners', path: '/partners' },
    { key: 'careers', path: '/careers' },
  ],
  services: [
    { key: 'packages', path: '/packages' },
    { key: 'custom_tour', path: '/custom' },
    { key: 'group_tour', path: '/group' },
    { key: 'vip_service', path: '/vip' },
  ],
  support: [
    { key: 'help_center', path: '/help' },
    { key: 'contact_us', path: '/contact' },
    { key: 'faq', path: '/faq' },
    { key: 'emergency', path: '/emergency' },
  ],
  legal: [
    { key: 'terms', path: '/terms' },
    { key: 'privacy', path: '/privacy' },
    { key: 'medical_disclaimer', path: '/disclaimer' },
    { key: 'cookie', path: '/cookies' },
  ],
};

const socials = [
  { icon: Instagram, label: 'Instagram', url: '#' },
  { icon: Youtube, label: 'YouTube', url: '#' },
  { icon: Twitter, label: 'Twitter', url: '#' },
];

const paymentIcons = ['Visa', 'Mastercard', 'PayPal', 'Alipay', 'WeChat Pay'];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-300 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="font-heading font-bold text-lg text-white">
                K-MEDI <span className="text-primary-400">TOUR</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Your Treatment, Your Trip — All in One Package.
            </p>
            <div className="flex gap-3">
              {socials.map(s => (
                <a key={s.label} href={s.url} className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
                {t(`footer.${section}`)}
              </h4>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.key}>
                    <Link to={link.path} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {t(`footer.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-wrap gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+82-2-1234-5678</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>support@kmeditour.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Seoul, South Korea</span>
            </div>
          </div>
        </div>

        {/* Payment & Copyright */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {paymentIcons.map(name => (
              <div key={name} className="px-2.5 py-1 bg-gray-800 rounded text-xs text-gray-400 font-medium">
                {name}
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-500 text-center md:text-right">
            <p>{t('footer.copyright')}</p>
            <p className="mt-1">{t('footer.business_info')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
