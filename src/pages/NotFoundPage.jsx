import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50"
    >
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="w-28 h-28 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <MapPin className="w-14 h-14 text-primary-400" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-8xl font-extrabold text-gray-200 mb-4 font-heading"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-800 mb-3"
        >
          {t('not_found.title', 'Page Not Found')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 mb-8 leading-relaxed"
        >
          {t('not_found.message', 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/">
            <Button variant="primary" size="lg" icon={Home}>
              {t('not_found.go_home', 'Go Home')}
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
