import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { heroSlides, features, segments, testimonials, clients } from '../mockData';
import { ChevronLeft, ChevronRight, ScanFace, QrCode, Monitor, Smartphone, ShieldCheck, FileText, Building2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const iconMap = {
    'scan-face': ScanFace,
    'qr-code': QrCode,
    'monitor': Monitor,
    'smartphone': Smartphone,
    'shield-check': ShieldCheck,
    'file-text': FileText
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const nextTestimonial = () => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Carousel */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.7)), url('${slide.image}')`
              }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                <div className="max-w-3xl">
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <Button
                    onClick={() => navigate('/solucao')}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-green-500/50 hover:scale-105"
                  >
                    {slide.cta}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-10">
          <button
            onClick={prevSlide}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? 'w-8 bg-green-500' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Recursos Principais</h2>
            <div className="w-20 h-1 bg-green-500 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tecnologia de ponta para transformar a gestão de acessos do seu condomínio comercial
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = iconMap[feature.icon];
              return (
                <Card key={feature.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white hover:-translate-y-2">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500 transition-colors">
                      <Icon className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solution Details Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">A Solução</h2>
            <div className="w-20 h-1 bg-green-500 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Os principais empreendimentos comerciais já adotaram nossa solução. E o seu?
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1697382608786-bcf4c113b86e?w=600"
                alt="Controle de Acesso"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Nossa rotina está se tornando cada vez mais digital: por meio de aplicativos você realiza uma série de tarefas cotidianas… então, por que o acesso aos edifícios ainda é feito de maneira analógica?
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Com nossa solução, você vivencia uma experiência totalmente digital no controle de acesso. De forma mais rápida e simples, o empreendimento conta com um sistema moderno que garante mais segurança na gestão de acessos, redução de custos, melhor experiência para os usuários e adequação à LGPD.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                O processo de entrada nos edifícios passa a ser operado pelas próprias empresas, por meio do portal web e aplicativo mobile. Os visitantes realizam o check-in com seu próprio smartphone, gerando um QR Code que dá acesso às catracas do empreendimento.
              </p>
              <Button
                onClick={() => navigate('/solucao')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg rounded-lg transition-all"
              >
                Saiba Mais
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Segments Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Segmentos</h2>
            <div className="w-20 h-1 bg-green-500 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Soluções personalizadas para cada tipo de negócio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {segments.map((segment) => (
              <Card key={segment.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-0">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={segment.image}
                    alt={segment.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{segment.title}</h3>
                  <p className="text-gray-600 text-sm">{segment.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Depoimentos</h2>
            <div className="w-20 h-1 bg-green-500 mx-auto mb-4"></div>
          </div>

          <div className="relative">
            <Card className="border-0 shadow-2xl">
              <CardContent className="p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <img
                      src={testimonials[currentTestimonial].photo}
                      alt={testimonials[currentTestimonial].name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-green-500 shadow-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-6xl text-green-500 mb-4">“</div>
                    <p className="text-xl text-gray-700 italic mb-6 leading-relaxed">
                      {testimonials[currentTestimonial].testimonial}
                    </p>
                    <div>
                      <p className="text-xl font-bold text-slate-900">{testimonials[currentTestimonial].name}</p>
                      <p className="text-green-600 font-medium">{testimonials[currentTestimonial].position}</p>
                      <p className="text-gray-600">{testimonials[currentTestimonial].company}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-all shadow-lg"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentTestimonial ? 'w-8 bg-green-600' : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="w-12 h-12 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-all shadow-lg"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Principais Clientes</h2>
            <div className="w-20 h-1 bg-green-500 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Condomínios comerciais que confiam em nossa solução</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {clients.map((client) => (
              <Card key={client.id} className="hover:shadow-lg transition-all duration-300 border-0">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Building2 className="w-12 h-12 text-green-500 mb-3" />
                  <h4 className="font-semibold text-slate-900 text-sm mb-1">{client.name}</h4>
                  <p className="text-gray-500 text-xs">{client.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(45deg, #22c55e 25%, transparent 25%, transparent 75%, #22c55e 75%, #22c55e), linear-gradient(45deg, #22c55e 25%, transparent 25%, transparent 75%, #22c55e 75%, #22c55e)',
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0, 30px 30px'
          }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Pronto para Modernizar Seu Condomínio?</h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Entre em contato conosco e descubra como podemos transformar a gestão de acessos do seu empreendimento
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/contato')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-green-500/50"
            >
              Fale Conosco
            </Button>
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-6 text-lg rounded-lg font-semibold transition-all"
            >
              Acessar Portal
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
