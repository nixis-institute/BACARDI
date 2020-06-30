import graphene
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from app.models import *
from graphene import relay
from django.contrib.auth.models import User
from graphene.relay.node import from_global_id
import datetime
from django.core.files import File
from django.template.loader import get_template 
from django.template import Context
import pdfkit
import os

class UserNode(DjangoObjectType):
    class Meta:
        model = User
        filter_fields=()
        interfaces = (graphene.Node,)
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
        mfg = graphene.String(required=True)
        discount = graphene.Float(required=True)
        hsn = graphene.String(required=True)
        batch = graphene.String(required=True)

    product = graphene.Field(ProductNode)
    isNew = graphene.Boolean()
    def mutate(self,info,medicine,qty,mrp,purchase_from,typeofpacking,gst,exp,discount,mfg,hsn,batch):
        product = Product.objects.filter(name=medicine)
        if(product):
            product = product[0]
            product.name = medicine
            product.qty = qty
            product.price = mrp
            product.purchase_from = purchase_from
            product.expiry_date = datetime.datetime.strptime(exp,"%Y-%m-%d") 
            product.type_of_packing = typeofpacking
            product.GST = gst
            product.discount = discount
            product.mfg = mfg
            product.hsn = hsn
            product.batch = batch
            product.save()
            return CreateProduct(product = product,isNew = False)
            

        else:
            product = Product.objects.create(
                name = medicine,
                qty = qty,
                price = mrp,
                purchase_from = purchase_from,
                expiry_date = datetime.datetime.strptime(exp,"%Y-%m-%d") ,
                type_of_packing = typeofpacking,
                GST = gst,
                discount = discount,
                mfg = mfg,
                hsn = hsn,
                batch = batch
            )
            return CreateProduct(product = product,isNew = True)
        

class MInput(graphene.InputObjectType):
    medicine_id = graphene.String(required=True)
    name = graphene.String(required=True)
    qty = graphene.Int()
    price = graphene.Float()
    # GST = graphene.Float()
    discount = graphene.Float()
    expiry = graphene.String()



def GenerateBill(gross,invoice_number,medicines,discount,cgst,total,bill):
    print("invoice ...")
    print(invoice_number)
    template = get_template("x.html")
    context = {"gross":gross,"medicines": medicines,"discount":discount,"cgst":cgst,"sgst":cgst,"total":total,"invoice":invoice_number,"bill":bill}
    html = template.render(context)
    options = {
    'page-size': 'A4',
    'margin-top': '50px',
    'margin-right': '50px',
    'margin-bottom': '50px',
    'margin-left': '50px',
    # 'orientation':'landscape'
    }
    pdfkit.from_string(html, '{}.pdf'.format(invoice_number),options=options)
    




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
        bill.invoice_number = "INV#{}-{}".format(bill.id,user_id)

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
                price = round(float(i["price"]),2),
                discount = round(float(i["discount"])),
                expiry_date = datetime.datetime.strptime(i["expiry"],"%Y-%m-%d"),
                CGST = round(float(i["price"]) * int(i["qty"]) * float(gst)/100/2,2),
                SGST = round(float(i["price"]) * int(i["qty"]) * float(gst)/100/2,2),
                total = round(int(i["qty"]) * float(i["price"]) - (i["price"]*i["qty"]*i["discount"]/100),2),
                billing_id = bill.id,
            )
        # bill = Billing.objects.get(id=14)
        # print(gross)
        # print(discount)
        # print(cgst)
        # print(total)
        
        bill.gross_amount = round(gross,2)
        bill.discount =round(discount,2)
        bill.cgst = round(cgst/2,2)
        bill.sgst = round(cgst/2,2)
        bill.net_amount = round(total,2)
        # bill.save() 

        GenerateBill(gross,bill.invoice_number,Medicine.objects.filter(billing_id=bill.id),discount,cgst,total,bill)
        pdfname = "{}.pdf".format(bill.invoice_number)
        # print(pdfname)
        with open(pdfname,'rb') as pdf:
            bill.invoice.save(pdfname,File(pdf),save=True)
        bill.save()
        os.remove(pdfname)
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

import graphql_jwt

class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    create_product = CreateProduct.Field()
    generate_bill = CreateBill.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()

class Query(graphene.AbstractType):
    all_patient = graphene.List(PatientNode)
    all_products = DjangoFilterConnectionField(ProductNode)
    product_by_id = graphene.Field(ProductNode,id=graphene.ID())
    product_suggestion = graphene.List(ProductNode,suggestion=graphene.String())
    report = DjangoFilterConnectionField(BillingNode,min=graphene.String(),max=graphene.String())
    history = DjangoFilterConnectionField(BillingNode,slug=graphene.String())
    user = graphene.Field(UserNode)


    def resolve_user(self,info):
        print("..user..")
        # user_id = info.context.user.id
        print(info.context.user)
        return User.objects.get(id = 1)

    # def resol

    def resolve_history(self,info,slug):
        if(Billing.objects.filter(invoice_number__iexact=slug)):
            return Billing.objects.filter(invoice_number__iexact=slug)
        
        return Billing.objects.filter(patient__name__iexact=slug)
        
        
        # else if(Billing.objects.filter(patient__name__iexact="aman"))

    def resolve_report(self,info,min,max):
        return Billing.objects.filter(billing_date__range=[min,max]).order_by('-id')


    def resolve_product_suggestion(self,info,suggestion):
        # return Product.objects.all()
        return Product.objects.filter(name__icontains=suggestion)

    def resolve_all_products(self,info,**kwargs):
        print(info.context.user)
        return Product.objects.all()
    
    def resolve_product_by_id(self,info,id):
        print(from_global_id(id)[1])
        return Product.objects.get(id=from_global_id(id)[1])
        
    def resolve_all_patient(self,info,**kwargs):
        return Patient.objects.all()
