import Image from "next/image";

export interface Business {
  banner: string;
  business_id: string;
  logo: string;
  name: string;
}

const IMAGE_PLACEHOLDER = "blur" as const;
const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjcyIiBoZWlnaHQ9IjcyIiBmaWxsPSIjZGRkIi8+PC9zdmc+" as const;

const Header = ({ business }: { business: Business }) => {
  return (
    <header className="relative w-full">
      <div className="relative h-[35dvh] md:h-[30dvh] w-full">
        <Image
          src={business.banner || "/banner.png"}
          alt="Business banner"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
          placeholder={IMAGE_PLACEHOLDER}
          blurDataURL={BLUR_DATA_URL}
        />
      </div>

      <section className="relative flex flex-col items-center px-4">
        <div className="absolute -top-0 -translate-y-1/2 w-[72px] h-[72px] rounded-full overflow-hidden shadow-bg-primary/50 shadow-md">
          <Image
            src={business.logo || "/images/brand-assets/logo/logo.svg"}
            alt="Business Logo"
            width={72}
            height={72}
            className="object-cover object-center"
            placeholder={IMAGE_PLACEHOLDER}
            blurDataURL={BLUR_DATA_URL}
          />
        </div>

        <h1 className="mt-12 text-2xl font-semibold font-display text-text-primary">
          {business.name}
        </h1>
      </section>
    </header>
  );
};

export default Header;
