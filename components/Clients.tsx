"use client";

import { Building2, Utensils, ShoppingCart, Briefcase, Landmark } from 'lucide-react';

const clients = [
  { name: 'الفنادق والمنتجعات', icon: Building2 },
  { name: 'المطاعم والكافيهات', icon: Utensils },
  { name: 'الأسواق المركزية', icon: ShoppingCart },
  { name: 'شركات التموين والإعاشة', icon: Briefcase },
  { name: 'الجهات الحكومية', icon: Landmark },
];

export default function Clients() {
  const repeatedClients = [...clients, ...clients, ...clients, ...clients];

  return (
    <section className="py-24 bg-white overflow-hidden border-y border-gray-100">
      <div className="container mx-auto px-4 md:px-8 mb-16">
        <div className="text-center">
          <h2 className="font-cairo text-2xl md:text-4xl font-bold text-blue-deep mb-4">
            شركاء النجاح
          </h2>
          <div className="w-16 h-1 bg-orange-accent mx-auto rounded-full" />
        </div>
      </div>

      <div
        className="relative flex overflow-hidden bg-white w-full scrollbar-hide"
        style={{ direction: 'ltr' }}
      >
        <div className="animate-marquee flex whitespace-nowrap min-w-max items-center py-4 gpu-accelerated">
          {repeatedClients.map((client, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center w-48 md:w-64 opacity-50 hover:opacity-100 transition-opacity duration-300 group"
            >
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:bg-blue-primary transition-colors duration-300">
                <client.icon
                  size={36}
                  className="text-blue-deep group-hover:text-white transition-colors duration-300"
                />
              </div>
              <span
                className="font-cairo font-bold text-lg text-text-dark"
                style={{ direction: 'rtl' }}
              >
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
