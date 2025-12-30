import { Product } from "@/types/product";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md bg-gray-50">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Added</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>
                <div className="relative h-12 w-12 rounded-md overflow-hidden border">
                  <img
                    src={product.image || "/placeholder-product.png"}
                    alt={product.title}
                    
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium max-w-[200px] truncate">
                {product.title}
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>
                ${product.price.toFixed(2)}
                {product.discount && (
                  <span className="text-xs text-gray-500 line-through ml-2">
                    ${product.discount.toFixed(2)}
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {product.isNewProduct && (
                    <Badge variant="secondary" className="bg-[#BD9B58]/20 text-[#BD9B58] hover:bg-[#BD9B58]/30">
                      New
                    </Badge>
                  )}
                  {product.isFeatured && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                      Featured
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-gray-500 text-sm">
                {formatDate(product.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(product)}
                    title="Edit product"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(product)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="Delete product"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 