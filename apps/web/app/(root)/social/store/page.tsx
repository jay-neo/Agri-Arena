import StoreSearchBar from "~/components/ui/store/StoreSearchBar";
import { StoreBanner } from "./StoreBanner";
import { CartButton } from "~/components/ui/store/CartButton";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <div>
        <div className="p-0.5">
          <div className="sticky">
            <div className="relative w-full ">
              <div className="mt-1 mx-auto max-w-2xl">
                <div className="flex overflow-hidden mx-1">
                  <Suspense>
                    <StoreSearchBar />
                  </Suspense>
                  <CartButton />
                  <div className="pl-2">{/* <ImageProcessingButton /> */}</div>
                </div>
              </div>
              {/* <SearchTopics /> */}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center">
            {/* <Activities topic={searchParams.topic} query={searchParams.query} /> */}
          </div>
        </div>

        <StoreBanner />
      </div>
    </>
  );
}
