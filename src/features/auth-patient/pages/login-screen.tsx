import { WebHeader } from '@/components/layout';
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui';
import { useOnboarding } from '@/features/auth-patient/api';
import { LoginForm, MediaCard, TestimonialCard } from '@/features/auth-patient/components';
import { HeartIcon, MoonIcon, OpenBookIcon } from '@/icons';

function getStepIcon(step: number) {
  switch (step) {
    case 3:
      return <MoonIcon size={48} fillColor="headingPrimary" />;
    case 5:
      return <OpenBookIcon size={48} fillColor="headingPrimary" />;
    default:
      return <HeartIcon size={48} fillColor="headingPrimary" />;
  }
}

export default function LoginScreen() {
  const { data } = useOnboarding();

  const slides = data?.data ?? [];

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <WebHeader />

      <div className="flex flex-1 flex-col items-start px-8 pt-8 lg:items-center lg:justify-center lg:px-27 lg:py-2">
        <div className="flex w-full max-w-209 flex-col">
          <h1 className="text-heading-primary font-heading w-full pb-10 text-center text-3xl font-medium tracking-[-0.16px] lg:text-left">
            Bienvenue sur Luna
          </h1>

          <div className="flex w-full flex-col items-start gap-10 lg:flex-row lg:gap-22">
            <LoginForm />

            <div className="hidden w-104 flex-col gap-2 lg:flex">
              {slides.length > 0 && (
                <Carousel>
                  <CarouselContent>
                    {slides.map((step, index) => (
                      <CarouselItem key={step.step}>
                        {step.media ? (
                          <MediaCard src={step.media} index={index} className="h-117 w-104" />
                        ) : (
                          <TestimonialCard
                            icon={getStepIcon(step.step)}
                            title={step.title ?? ''}
                            description={step.description ?? undefined}
                            points={step.paragraphs ?? []}
                          />
                        )}
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="mt-2 flex items-center justify-between">
                    <CarouselPrevious />
                    <CarouselDots />
                    <CarouselNext />
                  </div>
                </Carousel>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
