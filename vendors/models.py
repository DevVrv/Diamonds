from filter.models import Base_Diamond_Model

# * filter diamond model
class Vedor_Diamond_Model(Base_Diamond_Model):
    
    class Meta:
        verbose_name = 'Diamond'
        verbose_name_plural = 'Diamonds'
        ordering = ['sale_price']
        


class Fancy_Vedor_Diamond_Model(Base_Diamond_Model):
    
    class Meta:
        verbose_name = 'Fancy Diamond'
        verbose_name_plural = 'Fancy Diamonds'
        ordering = ['sale_price']



