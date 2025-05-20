import { useState, useEffect } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import { Card, CardContent, Typography, Rating, Chip } from '@mui/material';
import CustomAvatar from '@core/components/mui/Avatar';
import { useLocalizedTestimonials } from '@/hooks/useLocalizedTestimonials';
import 'keen-slider/keen-slider.min.css';
import AppKeenSlider from '@/libs/styles/AppKeenSlider';
import CustomIconButton from '@/@core/components/mui/IconButton';

// New component for expandable description
const ExpandableDesc = ({ text }: { text: string }) => {
  const [expanded, setExpanded] = useState(false);
  // Set a threshold to determine if the text is long enough to warrant a toggle.
  const isLong = text.length > 120;

  return (
    <div>
      <Typography className={!expanded ? "line-clamp-5" : ""} title={text}>
        {text}
      </Typography>
      {isLong && (
        <Typography
          variant="caption"
          onClick={() => setExpanded(!expanded)}
          style={{ cursor: "pointer", color: "#811745", marginTop: 4 }}
        >
          {expanded ? "View Less" : "View More"}
        </Typography>
      )}
    </div>
  );
};

export const TestimonialSlider = () => {
  const { testimonials, loading, error } = useLocalizedTestimonials();
  const [isMounted, setIsMounted] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      slides: {
        perView: 3,
        spacing: 16,
        origin: 'auto'
      },
      breakpoints: {
        '(max-width: 1200px)': {
          slides: {
            perView: 2,
            spacing: 16,
            origin: 'auto'
          }
        },
        '(max-width: 900px)': {
          slides: {
            perView: 2,
            spacing: 16
          }
        },
        '(max-width: 600px)': {
          slides: {
            perView: 1,
            spacing: 16,
            origin: 'center'
          }
        }
      },
      created: () => {
        setIsMounted(true);
      }
    }
  );

  useEffect(() => {
    // Auto-play functionality
    const keenSlider = instanceRef.current;
    if (!keenSlider) return;

    let timeout: ReturnType<typeof setTimeout>;
    let mouseOver = false;

    function clearNextTimeout() {
      clearTimeout(timeout);
    }

    function nextTimeout() {
      clearTimeout(timeout);
      if (mouseOver) return;
      timeout = setTimeout(() => {
        keenSlider?.next();
      }, 4000);
    }

    // Start autoplay
    nextTimeout();

    // Add event listeners for mouse interactions using the element directly from instanceRef
    const sliderElement = keenSlider.container;
    if (sliderElement) {
      const handleMouseEnter = () => {
        mouseOver = true;
        clearNextTimeout();
      };

      const handleMouseLeave = () => {
        mouseOver = false;
        nextTimeout();
      };

      sliderElement.addEventListener('mouseenter', handleMouseEnter);
      sliderElement.addEventListener('mouseleave', handleMouseLeave);

      // Events for slider
      keenSlider.on('dragStarted', clearNextTimeout);
      keenSlider.on('animationEnded', nextTimeout);
      keenSlider.on('updated', nextTimeout);

      // Cleanup
      return () => {
        clearTimeout(timeout);
        sliderElement.removeEventListener('mouseenter', handleMouseEnter);
        sliderElement.removeEventListener('mouseleave', handleMouseLeave);
      };
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [instanceRef]);

  if (loading)
    return <Typography className="p-8 text-center">Loading testimonials...</Typography>;
  if (error)
    return <Typography color="error" className="p-8 text-center">Error loading testimonials</Typography>;
  if (!testimonials || testimonials.length === 0)
    return <Typography className="p-8 text-center">No testimonials available</Typography>;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className='flex flex-col gap-1 justify-center items-center lg:items-start w-full md:w-[30%] mb-auto sm:pb-2'>
        <Chip label='Real Customers Reviews' size='small' className="mb-3 text-white bg-[#811745]" variant='tonal' color='primary' />
        <div className='flex flex-col gap-y-1 flex-wrap max-lg:text-center'>
          <Typography color='text.primary' variant='h4'>
            <span className='relative z-[1] font-extrabold'>
              What people say
            </span>
          </Typography>
          <Typography>See what our customers have to say about their experience.</Typography>
        </div>
        <div className='flex gap-x-4 mt-11'>
          <CustomIconButton className="text-white bg-[#811745]" color='primary' variant='tonal' onClick={() => instanceRef.current?.prev()}>
            <i className='tabler-chevron-left' />
          </CustomIconButton>
          <CustomIconButton className="text-white bg-[#811745]" color='primary' variant='tonal' onClick={() => instanceRef.current?.next()}>
            <i className='tabler-chevron-right' />
          </CustomIconButton>
        </div>
      </div>

      <div className='w-full px-4 sm:px-6 max-w-sm md:max-w-2xl md:ml-[12vw] mx-auto'>
        <AppKeenSlider>
          <div className="relative overflow-hidden max-w-full">
            <div ref={sliderRef} className="keen-slider">
              {testimonials.map((item, index) => (
                <div key={index} className="keen-slider__slide ">
                  <Card elevation={3} className="h-full ">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 h-full">
                        <div className="testimonial-content overflow-auto max-h-40">
                          <ExpandableDesc text={item.localizedDesc} />
                        </div>
                        <div className="mt-auto">
                          <Rating value={item.rating} readOnly size="small" className="mb-4" />
                          <div className="flex items-center gap-3">
                            <CustomAvatar size={40} src={item.avatarSrc} alt={item.name} />
                            <div className="flex flex-col">
                              <Typography variant="subtitle2" className="font-medium">
                                {item.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.position}
                              </Typography>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Add custom CSS for handling long descriptions */}
          <style jsx global>{`
            .line-clamp-5 {
              display: -webkit-box;
              -webkit-line-clamp: 5;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .testimonial-content {
              scrollbar-width: thin;
              scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
            }

            .testimonial-content::-webkit-scrollbar {
              width: 4px;
            }

            .testimonial-content::-webkit-scrollbar-track {
              background: transparent;
            }

            .testimonial-content::-webkit-scrollbar-thumb {
              background-color: rgba(0, 0, 0, 0.2);
              border-radius: 20px;
            }
          `}</style>
        </AppKeenSlider>
      </div>
    </div>
  );
};
