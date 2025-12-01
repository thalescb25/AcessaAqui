import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { colors } from '../theme';

const ContactButton = ({ variant = 'fixed' }) => {
  const handleContact = () => {
    window.location.href = 'mailto:neuraone.ai@gmail.com?subject=Contato ChegouAqui';
  };

  if (variant === 'fixed') {
    return (
      <button
        onClick={handleContact}
        className="fixed bottom-6 right-6 shadow-2xl rounded-full p-4 hover:scale-110 transition-transform z-50"
        style={{ backgroundColor: colors.yellow }}
        title="Fale Conosco"
      >
        <MessageCircle className="w-6 h-6" style={{ color: colors.black }} />
      </button>
    );
  }

  return (
    <Button
      onClick={handleContact}
      variant="outline"
      className="w-full"
      style={{ borderColor: colors.yellow, color: colors.yellow }}
    >
      <MessageCircle className="w-4 h-4 mr-2" />
      Fale Conosco
    </Button>
  );
};

export default ContactButton;
