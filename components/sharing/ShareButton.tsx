'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Link, X, Check, MessageCircle, Mail, Twitter, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useDeepLinking } from '@/utils/deepLinking';
import toast from 'react-hot-toast';

interface ShareButtonProps {
  type: 'booking' | 'driver' | 'ride' | 'payment' | 'promo';
  id: string;
  title?: string;
  text?: string;
  className?: string;
  variant?: 'button' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg';
}

interface ShareOption {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  action: () => void;
}

export function ShareButton({
  type,
  id,
  title,
  text,
  className = '',
  variant = 'button',
  size = 'md'
}: ShareButtonProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const { share, createLink } = useDeepLinking();

  const getDefaultTitle = () => {
    switch (type) {
      case 'booking':
        return 'Check out my taxi booking';
      case 'driver':
        return 'Great driver I found';
      case 'ride':
        return 'My current ride';
      case 'payment':
        return 'Payment details';
      case 'promo':
        return 'Use this promo code';
      default:
        return 'Check this out';
    }
  };

  const getDefaultText = () => {
    switch (type) {
      case 'booking':
        return 'I just booked a taxi ride with Goa Taxi!';
      case 'driver':
        return 'I found an excellent driver on Goa Taxi!';
      case 'ride':
        return 'I\'m currently on a ride with Goa Taxi!';
      case 'payment':
        return 'Payment details from my Goa Taxi ride';
      case 'promo':
        return 'Use this promo code for a discount on Goa Taxi!';
      default:
        return 'Check out this amazing service!';
    }
  };

  const handleShare = async (platform?: string) => {
    try {
      const shareTitle = title || getDefaultTitle();
      const shareText = text || getDefaultText();
      
      if (platform) {
        // Platform-specific sharing
        switch (platform) {
          case 'native':
            await share(`/${type}`, { id }, shareTitle, shareText);
            break;
          case 'copy':
            const link = createLink(`/${type}`, { id });
            await navigator.clipboard.writeText(link);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
            break;
          case 'whatsapp':
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${createLink(`/${type}`, { id })}`)}`;
            window.open(whatsappUrl, '_blank');
            break;
          case 'email':
            const emailUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${createLink(`/${type}`, { id })}`)}`;
            window.open(emailUrl, '_blank');
            break;
          case 'twitter':
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareText} ${createLink(`/${type}`, { id })}`)}`;
            window.open(twitterUrl, '_blank');
            break;
          case 'facebook':
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(createLink(`/${type}`, { id }))}`;
            window.open(facebookUrl, '_blank');
            break;
        }
      } else {
        // Native sharing
        await share(`/${type}`, { id }, shareTitle, shareText);
      }
      
      setShowShareMenu(false);
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share');
    }
  };

  const shareOptions: ShareOption[] = [
    {
      id: 'native',
      name: 'Share',
      icon: Share2,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => handleShare('native')
    },
    {
      id: 'copy',
      name: 'Copy Link',
      icon: copied ? Check : Copy,
      color: copied ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700',
      action: () => handleShare('copy')
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => handleShare('whatsapp')
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => handleShare('email')
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      action: () => handleShare('twitter')
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => handleShare('facebook')
    }
  ];

  const renderButton = () => {
    switch (variant) {
      case 'icon':
        return (
          <button
            onClick={() => setShowShareMenu(true)}
            className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors ${className}`}
          >
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
        );
      
      case 'text':
        return (
          <button
            onClick={() => setShowShareMenu(true)}
            className={`text-blue-600 hover:text-blue-700 font-medium ${className}`}
          >
            Share
          </button>
        );
      
      default:
        return (
          <Button
            onClick={() => setShowShareMenu(true)}
            size={size}
            variant="outline"
            className={className}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        );
    }
  };

  return (
    <div className="relative">
      {renderButton()}

      {/* Share Menu */}
      <AnimatePresence>
        {showShareMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowShareMenu(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">Share</h3>
                <button
                  onClick={() => setShowShareMenu(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Share Options */}
              <div className="p-2">
                <div className="grid grid-cols-2 gap-2">
                  {shareOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={option.action}
                      className={`
                        flex items-center space-x-2 p-3 rounded-lg text-white text-sm font-medium
                        transition-colors ${option.color}
                      `}
                    >
                      <option.icon className="w-4 h-4" />
                      <span>{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Share this {type} with friends and family
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Quick share buttons for specific platforms
export function WhatsAppShareButton({ type, id, title, text, className = '' }: ShareButtonProps) {
  const { createLink } = useDeepLinking();

  const handleShare = () => {
    const shareText = text || 'Check this out!';
    const link = createLink(`/${type}`, { id });
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${link}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      onClick={handleShare}
      className={`bg-green-500 hover:bg-green-600 text-white ${className}`}
    >
      <MessageCircle className="w-4 h-4 mr-2" />
      Share on WhatsApp
    </Button>
  );
}

export function EmailShareButton({ type, id, title, text, className = '' }: ShareButtonProps) {
  const { createLink } = useDeepLinking();

  const handleShare = () => {
    const shareTitle = title || 'Check this out';
    const shareText = text || 'I found this interesting';
    const link = createLink(`/${type}`, { id });
    const emailUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${link}`)}`;
    window.open(emailUrl, '_blank');
  };

  return (
    <Button
      onClick={handleShare}
      className={`bg-blue-500 hover:bg-blue-600 text-white ${className}`}
    >
      <Mail className="w-4 h-4 mr-2" />
      Share via Email
    </Button>
  );
}
