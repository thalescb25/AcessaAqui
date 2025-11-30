import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Package, CheckCircle, LogOut, History, Home, ArrowLeft } from 'lucide-react';

const DoormanPanel = ({ user, onLogout }) => {
  const [apartments, setApartments] = useState([]);
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [sending, setSending] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [todayDeliveries, setTodayDeliveries] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [buildingRes, apartmentsRes] = await Promise.all([
        axios.get(`${API}/admin/building`),
        axios.get(`${API}/admin/apartments`),
      ]);

      setBuilding(buildingRes.data);
      setApartments(apartmentsRes.data);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await axios.get(`${API}/doorman/deliveries/today`);
      setTodayDeliveries(response.data);
      setShowHistory(true);
    } catch (error) {
      toast.error('Erro ao carregar histórico');
    }
  };

  const handleApartmentClick = async (apartment) => {
    setSelectedApartment(apartment);
    setSending(true);

    try {
      const response = await axios.post(`${API}/doorman/delivery`, {
        apartment_id: apartment.id,
      });

      if (response.data.status === 'success') {
        toast.success(`Notificação enviada para o apartamento ${apartment.number}!`);
      } else {
        toast.error('Falha ao enviar notificação');
      }
    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.detail?.includes('Cota')) {
        toast.error('Cota de mensagens excedida! Contate o administrador.');
      } else if (error.response?.status === 400 && error.response?.data?.detail?.includes('telefone')) {
        toast.error('Nenhum telefone cadastrado para este apartamento');
      } else {
        toast.error('Erro ao registrar entrega');
      }
      setSelectedApartment(null);
    } finally {
      setSending(false);
    }
  };

  const handleBackToPanel = () => {
    setSelectedApartment(null);
    setShowHistory(false);
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Tela de confirmação
  if (selectedApartment && !sending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-emerald-600">Enviado!</CardTitle>
            <CardDescription className="text-lg mt-2">
              Notificação WhatsApp enviada
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="text-sm text-slate-600 mb-2">Apartamento</p>
              <p className="text-5xl font-bold text-slate-900">{selectedApartment.number}</p>
            </div>

            <Button
              onClick={handleBackToPanel}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-lg"
              data-testid="back-to-panel-button"
            >
              <Home className="w-5 h-5 mr-2" />
              Voltar ao Painel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Tela de histórico
  if (showHistory) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBackToPanel}
              className="text-slate-600"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-semibold text-slate-900">Entregas de Hoje</h1>
            <div className="w-20"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {todayDeliveries.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Nenhuma entrega registrada hoje</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {todayDeliveries.map((delivery) => (
                <Card key={delivery.id} className="border-l-4 border-l-emerald-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-lg">Apartamento {delivery.apartment_number}</p>
                        <p className="text-sm text-slate-600">
                          {new Date(delivery.timestamp).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Por: {delivery.doorman_name}</p>
                      </div>
                      <Badge variant={delivery.status === 'success' ? 'default' : 'destructive'}>
                        {delivery.status === 'success' ? 'Enviado' : 'Falhou'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Painel principal - Grid de apartamentos
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                {building?.name}
              </h1>
              <p className="text-sm text-slate-600">Bem-vindo, {user?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={loadHistory}
                className="h-10"
                data-testid="history-button"
              >
                <History className="w-5 h-5 mr-2" />
                Histórico
              </Button>
              <Button
                variant="outline"
                onClick={onLogout}
                className="h-10 text-red-600 hover:text-red-700 hover:bg-red-50"
                data-testid="logout-button"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Instruções */}
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Package className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-emerald-900 mb-1">Registrar Encomenda</h3>
                <p className="text-sm text-emerald-700">
                  Clique no botão do apartamento para registrar a chegada de uma encomenda.
                  Uma notificação WhatsApp será enviada automaticamente para todos os moradores cadastrados.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid de Apartamentos */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {apartments.map((apartment) => (
            <Button
              key={apartment.id}
              onClick={() => handleApartmentClick(apartment)}
              disabled={sending}
              className="h-20 text-2xl font-bold bg-white hover:bg-emerald-600 hover:text-white text-slate-900 border-2 border-slate-200 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200"
              data-testid={`apartment-button-${apartment.number}`}
            >
              {apartment.number}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoormanPanel;
