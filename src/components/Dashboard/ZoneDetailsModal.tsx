'use client';
import { useEffect, useState } from 'react';
import { X, MapPin, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import axios from 'axios';

interface ZoneDetailsModalProps {
  zoneId: number | null;
  zoneName: string;
  onClose: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_MAP_API_URL || 'http://localhost:5000';

export default function ZoneDetailsModal({ zoneId, zoneName, onClose }: ZoneDetailsModalProps) {
  const t = useTranslations('Modal');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/api/zone/details`, { params: { zone_id: zoneId } });
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
        };

        if (zoneId) {
        fetchData();
        }
    }, [zoneId]);

  if (!zoneId) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[80vh]">

        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <MapPin size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">{t('zone_details')}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{zoneName}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-0 overflow-y-auto flex-1 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 text-gray-400">
              <Loader2 size={32} className="animate-spin mb-2" />
              <span className="text-sm">{t('loading')}</span>
            </div>
          ) : data.length === 0 ? (
            <div className="p-10 text-center text-gray-500 dark:text-gray-400">
              {t('no_data')}
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-semibold uppercase text-xs tracking-wider">{t('sector')}</th>
                  <th className="px-6 py-3 text-right text-gray-500 dark:text-gray-400 font-semibold uppercase text-xs tracking-wider">{t('volume')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {data.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">{item.sector}</p>
                      <span className="text-xs text-gray-400">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-gray-900 dark:text-white text-base">
                        {item.volume.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">{item.unit}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
