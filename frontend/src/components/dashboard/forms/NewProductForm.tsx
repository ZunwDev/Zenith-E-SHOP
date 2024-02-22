import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Brand, Category } from "../products/interfaces";
import { DebouncedBrandsAndCategories } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductImageManager from "../products/components/ProductImageManager";
import { InputFormItem, SelectFormItem, TextareaFormItem } from "@/components/util/FormItems";

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "You must specify product name.",
  }),
  description: z.string().min(1, {
    message: "You must specify product description.",
  }),
  price: z
    .number()
    .nullable()
    .refine((val) => val !== null && val >= 1, {
      message: "You must specify product price in USD",
    }),
  discount: z.number().optional(),
  quantity: z
    .number()
    .nullable()
    .refine((val) => val !== null && val >= 1, {
      message: "You must specify the quantity of product.",
    }),
  category: z.string().min(1, {
    message: "You must specify the category of product.",
  }),
  brand: z.string().min(1, {
    message: "You must specify the brand of product.",
  }),
});

export default function NewProductForm() {
  //Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  //Select stuff
  const [openCategory, setOpenCategory] = useState(false);
  const [openBrands, setOpenBrands] = useState(false);
  const [categoriesSelectedValue, setCategoriesSelectedValue] = useState("");
  const [brandsSelectedValue, setBrandsSelectedValue] = useState("");

  //Images
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageThumbnail, setImageThumbnail] = useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: null,
      discount: 0,
      quantity: null,
      category: "",
      brand: "",
    },
  });

  const fetchData = async () => {
    const [categoryData, brandData] = await DebouncedBrandsAndCategories();
    setCategories(categoryData);
    setBrands(brandData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setImageThumbnail(images[0]);
  }, [images]);

  //const handleNewProjectClick = async (values: z.infer<typeof FormSchema>) => {};

  return (
    <div className="flex flex-col gap-20">
      <div className="md:px-0 px-4 flex justify-between flex-row border-b pb-4">
        <div className="flex flex-col gap-1 xs:mx-auto xs:text-center sm:mx-0 sm:text-start">
          <h1 className="text-3xl font-bold w-full">New Product</h1>
          <h2>Add new product to ZENITH store</h2>
        </div>
      </div>
      <div className="flex md:flex-row md:gap-8 gap-32 flex-col">
        <div className="flex flex-col md:w-80 w-full h-full">
          <ProductImageManager
            images={images}
            imageThumbnail={imageThumbnail}
            selectedImages={selectedImages}
            setImageThumbnail={setImageThumbnail}
            setImages={setImages}
            setSelectedImages={setSelectedImages}
          />
        </div>

        <Card className="w-full border h-fit rounded-md">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Enter key product details for comprehensive information.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="flex md:flex-row md:gap-20 gap-4 flex-col">
                <div className="flex flex-col md:w-1/3 w-full gap-4">
                  <InputFormItem
                    label="Product Name"
                    id="name"
                    placeholder="HP EliteBook 650 G10"
                    form={form}
                    required
                    description="Enter the name of the product."></InputFormItem>
                  <TextareaFormItem
                    label="Product Description"
                    id="description"
                    form={form}
                    required
                    description="Briefly describe the product and its main features."
                    placeholder='Notebook - Intel Core i5 1345U Raptor Lake, 15.6" IPS anti-glare 1920×1080, RAM 16GB DDR4, Intel Iris Xe Graphics, SSD 512GB, numeric keypad, backlit keypad, webcam, USB 3.2 Gen 1, USB-C, fingerprint reader, WiFi 6E, WiFi, Bluetooth, Weight 1.78 kg, Windows 11 Pro'></TextareaFormItem>
                </div>
                <div className="flex flex-col md:w-1/4 w-full gap-4">
                  <InputFormItem
                    label="Price"
                    id="price"
                    type="number"
                    placeholder="49.99"
                    required
                    description="Specify the price of the product. Always end the price with 9 (e.g., 49)."
                    form={form}
                    prefix="$"></InputFormItem>
                  <InputFormItem
                    label="Discount"
                    id="discount"
                    type="number"
                    placeholder="20"
                    description="Set the discount percentage for the product (e.g., 20 for 20% off)."
                    form={form}
                    suffix="%"></InputFormItem>
                  <InputFormItem
                    label="Quantity"
                    id="quantity"
                    type="number"
                    placeholder="100"
                    required
                    description="Enter the quantity of the product in stock."
                    form={form}></InputFormItem>
                </div>
                <div className="flex flex-col md:w-1/4 w-full gap-4">
                  <SelectFormItem
                    label="Category"
                    id="category"
                    placeholder="Search categories..."
                    description="Select corresponding category to the product."
                    required
                    form={form}
                    data={categories}
                    open={openCategory}
                    setOpen={setOpenCategory}
                    selectedValue={categoriesSelectedValue}
                    setSelectedValue={setCategoriesSelectedValue}></SelectFormItem>
                  <SelectFormItem
                    label="Brand"
                    id="brand"
                    placeholder="Search brands..."
                    description="Select corresponding brand to the product."
                    required
                    form={form}
                    data={brands}
                    open={openBrands}
                    setOpen={setOpenBrands}
                    selectedValue={brandsSelectedValue}
                    setSelectedValue={setBrandsSelectedValue}></SelectFormItem>
                </div>
                {/*               <Button type="submit" onClick={form.handleSubmit(handleNewProjectClick)} className="mt-4">
                Create
              </Button> */}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
