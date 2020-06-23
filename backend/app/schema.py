import graphene
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from app.models import *
from graphene import relay
from django.contrib.auth.models import User
from graphene.relay.node import from_global_id
import datetime

class UserNode(DjangoObjectType):
    class Meta:
        model = User
        interfaces = (relay.Node,)
        # interfaces = (relay.Node,)

class ProductNode(DjangoObjectType):
    class Meta:
        model = Product
        filter_fields=()
        interfaces = (relay.Node,)
        
class ProfileNode(DjangoObjectType):
    class Meta:
        model = Profile
        filter_fields=()
        interfaces = (relay.Node,)

class BillingNode(DjangoObjectType):
    class Meta:
        model = Billing
        filter_fields=()
        interfaces = (relay.Node,)

class PatientNode(DjangoObjectType):
    class Meta:
        model = Patient
        filter_fields=()
        interfaces = (relay.Node,)
class MedicineNode(DjangoObjectType):
    class Meta:
        model = Medicine
        filter_fields=()
        interfaces = (relay.Node,)        

class CreateProduct(graphene.Mutation):
    class Arguments:
        medicine = graphene.String(required=True)
        qty = graphene.Int(required=True)
        mrp = graphene.Int(required=True)
        purchase_from = graphene.String(required=True)
        typeofpacking = graphene.String(required=True)
        gst = graphene.String(required=True)
        exp = graphene.String(required=True)
    product = graphene.Field(ProductNode)
    def mutate(self,info,medicine,qty,mrp,purchase_from,typeofpacking,gst,exp):
        # product = Product.objects.create(
        #     name = medicine,
        #     qty = qty,
        #     price = mrp,
        #     purchase_from = purchase_from,
        #     expiry_date = datetime.datetime.strptime(exp,"%Y-%m-%d") ,
        #     type_of_packing = typeofpacking,
        #     GST = gst
        # )
        return CreateProduct(product = Product.objects.all()[0])
        

class MInput(graphene.InputObjectType):
    medicine_id = graphene.String(required=True)
    name = graphene.String(required=True)
    qty = graphene.Int()
    price = graphene.Float()
    # GST = graphene.Float()
    discount = graphene.Float()
    expiry = graphene.String()




class CreateBill(graphene.Mutation):
    class Arguments:
        user_id = graphene.String(required = True)
        payment_mode = graphene.String(required=True)
        billing_date = graphene.String(required=True)
        gst = graphene.Float(required=True)
        medicines = graphene.List(MInput)
    bill = graphene.Field(BillingNode)
    def mutate(self,info,payment_mode,billing_date,gst,medicines,user_id):
        # print(medicines[0])
        user_id = from_global_id(user_id)[1]
        bill = Billing.objects.create( 
            user_id=1,invoice_number="INV#{}".format(user_id),patient_id=user_id,payment_mode=payment_mode,billing_date=datetime.datetime.strptime(billing_date,"%Y-%m-%d")
            )

        gross = total = discount = cgst =  0.0

        for i in medicines:
            gross += i["price"] * i["qty"]
            total += (i["price"] * i["qty"]) - (i["price"]*i["qty"] * i["discount"]/100)
            discount += i["price"]*i["qty"] * i["discount"]/100
            cgst += i["price"]*i["qty"] * gst /100


            Medicine.objects.create(
                medicine_id = from_global_id(i["medicine_id"])[1],
                medicine_name = i["name"],
                quantity = int(i["qty"]),
                price = float(i["price"]),
                discount = float(i["discount"]),
                expiry_date = datetime.datetime.strptime(i["expiry"],"%Y-%m-%d"),
                CGST = float(i["price"]) * int(i["qty"]) * float(gst)/100/2,
                SGST = float(i["price"]) * int(i["qty"]) * float(gst)/100/2,
                total = int(i["qty"]) * float(i["price"]) - float(i["discount"]),
                billing_id = bill.id
            )
        # bill = Billing.objects.get(id=14)
        # print(gross)
        # print(discount)
        # print(cgst)
        # print(total)
        
        bill.gross_amount = gross
        bill.discount =discount
        bill.cgst = cgst/2
        bill.sgst = cgst/2
        bill.net_amount = total
        bill.save() 
        

        return CreateBill(bill=bill)


        
class CreateUser(graphene.Mutation):
    # user = graphene.Field(UserNode)
    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)
        firstname = graphene.String(required=True)
        lastname = graphene.String(required=True)

    user = graphene.Field(UserNode)
    def mutate(self,info,username,password,email,firstname,lastname):
        user = get_user_model()(username = username,email = email,first_name = firstname,last_name=lastname)
        user.set_password(password)
        user.save()
        Profile.objects.create(user_id = user.id)
        return CreateUser(user=user)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    create_product = CreateProduct.Field()
    generate_bill = CreateBill.Field()

class Query(graphene.AbstractType):
    all_patient = graphene.List(PatientNode)
    all_products = DjangoFilterConnectionField(ProductNode)
    product_by_id = graphene.Field(ProductNode,id=graphene.ID())
    product_suggestion = graphene.List(ProductNode,suggestion=graphene.String())

    def resolve_product_suggestion(self,info,suggestion):
        # return Product.objects.all()
        return Product.objects.filter(name__icontains=suggestion)

    def resolve_all_products(self,info,**kwargs):
        return Product.objects.all()
    
    def resolve_product_by_id(self,info,id):
        print(from_global_id(id)[1])
        return Product.objects.get(id=from_global_id(id)[1])
        
    def resolve_all_patient(self,info,**kwargs):
        return Patient.objects.all()
