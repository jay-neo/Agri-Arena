import Image from "next/image";
import Link from "next/link";
import { StoreCartIcon } from "~/lib/arena-icons";

export const CartButton = () => {
  return (
    <>
      <Link
        href={"/social/store/cart"}
        className="items-center justify-between"
      >
        <div className="p-2 bg-cyan-200 rounded-md">
          <div className="items-center justify-between">
            <Image
              src={StoreCartIcon}
              alt="Cart"
              width={100}
              height={100}
              className="h-4 w-5"
            />
          </div>
        </div>
      </Link>
    </>
  );
};
