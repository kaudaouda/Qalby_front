import { FiTrendingUp, FiUsers, FiDollarSign, FiAward } from 'react-icons/fi';
import { useEffect, useState } from 'react';

const stats = [
  {
    icon: FiUsers,
    value: 15000,
    suffix: '+',
    label: 'Utilisateurs actifs',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FiTrendingUp,
    value: 12500,
    suffix: '+',
    label: 'Cagnottes créées',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: FiDollarSign,
    value: 750,
    suffix: 'M+',
    label: 'FCFA collectés',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: FiAward,
    value: 98,
    suffix: '%',
    label: 'Taux de satisfaction',
    color: 'from-amber-500 to-orange-500',
  },
];

export const Stats = () => {
  const [counters, setCounters] = useState(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          stats.forEach((stat, index) => {
            const duration = 2000;
            const steps = 60;
            const increment = stat.value / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= stat.value) {
                current = stat.value;
                clearInterval(timer);
              }
              setCounters(prev => {
                const newCounters = [...prev];
                newCounters[index] = Math.floor(current);
                return newCounters;
              });
            }, duration / steps);
          });
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById('stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section id="stats-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-qalby-orange-600">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-xl text-white opacity-90">
            Rejoignez des milliers d'utilisateurs qui réalisent leurs projets avec Qalby
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center space-y-4 group"
              >
                {/* Icon */}
                <div className="inline-flex p-6 rounded-2xl bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Value */}
                <div>
                  <div className="text-5xl sm:text-6xl font-bold text-white mb-1">
                    {counters[index].toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-lg text-white opacity-90 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
