import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { FIELD_CATEGORIES } from '@/constants/typeData.constants';
import type { FieldType } from '@/types/fakeData.types';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ModalType({
  field,
  isModalOpen,
  setIsModalOpen,
  onTypeChange,
}: {
  field: any;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  onTypeChange: (value: FieldType) => void;
}) {

  const { t } = useTranslation("fakeData"); 

  const [searchTerm, setSearchTerm] = useState("");

  const handleTypeChange = (value: FieldType) => {
    onTypeChange(value);
    setIsModalOpen(false);
  };

  const filteredCategories = FIELD_CATEGORIES.map((category) => ({
    ...category,
    types: category.types.filter((type) =>
      type.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.value.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((category) => category.types.length > 0);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="bg-white max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('modalType.selectFieldType')}</DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('modalType.searchPlaceholder')}
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredCategories.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            {t('modalType.noMatch')}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {filteredCategories.map((category) => (
              <div key={category.name} className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {category.name}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {category.types.map((type) => (
                    <Button
                      key={type.value}
                      variant={field.type === type.value ? "ghost" : "outline"}
                      className={`justify-start h-auto py-2 whitespace-normal text-left ${
                        field.type === type.value ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : ''
                      }`}
                      onClick={() => handleTypeChange(type.value as FieldType)}
                    >
                      {type.label}
                      {field.type === type.value && (
                        <Badge className="ml-2" variant="secondary">
                          {t('modalType.selected')}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}