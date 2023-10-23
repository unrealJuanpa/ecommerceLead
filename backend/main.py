from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import pymongo
from database import db
import bcrypt
from bson import json_util, ObjectId
import json
import time
import datetime


app = Flask(__name__)
CORS(app)
app.config['JWT_SECRET_KEY'] = 'patotective'
jwt = JWTManager(app)


@app.route('/login', methods=['GET', 'POST'])
@app.route('/login/<id>', methods=['GET', 'PUT', 'DELETE'])
def usuarios(id=None):
    try:
        if request.method == 'POST':
            assert list(request.get_json().keys()) == ['username', 'password']
            # print(request.get_json())
            usdata = db.usuarios.find_one(request.get_json())
            return jsonify({'token': create_access_token(json_util.dumps(usdata)), 'rol': usdata['rol']}), 200
    except Exception as ex:
        return jsonify({'message': f'ERROR: {ex}'}), 200
    

@app.route('/register', methods=['POST'])
def register():
    try:
        if request.method == 'POST':
            assert list(request.get_json().keys()) == ['username', 'password', 'direnvio']
            assert type(db.usuarios.find_one({'username': request.get_json()['username']})) == type(None), 'Usuario ya existe'
            data = request.get_json()
            data['rol'] = 0
            db.usuarios.insert_one(data)
            return jsonify({'message': 'Usuario creado con éxito!', 'rol': 0, 'token': create_access_token(json_util.dumps(data))}), 200
    except Exception as ex:
        return jsonify({'message': f'ERROR: {ex}'}), 200
    

@app.route('/verifytoken', methods=['POST'])
@jwt_required()
def verifytkn():
    try:
        if request.method == 'POST':
            # time.sleep(0.1)
            usdata = get_jwt_identity()
            usdata = json.loads(usdata)
            return jsonify({'rol': usdata['rol']}), 200
    except Exception as ex:
        return jsonify({'message': f'ERROR: {ex}'}), 400


@app.route('/productos', methods=['GET', 'POST'])
@app.route('/productos/<id>', methods=['GET', 'PUT', 'DELETE'])
def productos(id=None):
    try:
        if request.method == 'GET':
            if id: return json_util.dumps(db.productos.find({'_id': ObjectId(id)})), 200
            return json_util.dumps(db.productos.find({})), 200
        if request.method == 'POST':
            data = request.get_json()
            data['precio'] = float(data['precio'])
            data['stock'] = int(data['stock'])
            db.productos.insert_one(data)
            return jsonify({'message': 'Registro almacenado con éxito!'}), 200
        if request.method == 'PUT':
            data = request.get_json()
            data['precio'] = float(data['precio'])
            data['stock'] = int(data['stock'])
            db.productos.update_one({'_id': ObjectId(id)}, {'$set': data})
            return jsonify({'message': 'Registro modificado con éxito!'}), 200
        if request.method == 'DELETE':
            db.productos.delete_one({'_id': ObjectId(id)})
            return jsonify({'message': 'Registro eliminado con éxito!'}), 200
    except Exception as ex:
        return jsonify({'message': f'ERROR: {ex}'}), 400


@app.route('/carritos', methods=['GET', 'POST'])
@app.route('/carritos/<id>', methods=['DELETE'])
@app.route('/carritos/<username>', methods=['GET'])
def carritos(id=None, username=None):
    try:
        if request.method == 'GET':
            regs = list(db.carritos.find({'remote_addr': request.remote_addr, 'username': username}))
            regs = json_util.dumps(regs)
            regs = json.loads(regs)
            total = sum([d['subtotal'] for d in regs])
            return jsonify({'carrito': regs, 'total': total}), 200
        if request.method == 'POST':
            data = request.get_json()
            data['remote_addr'] = request.remote_addr
            data['producto'] = dict(db.productos.find_one({'_id': ObjectId(data['id'])}))
            data['subtotal'] = round(float(data['producto']['precio']) * int(data['cantidad']) * 100) / 100
            db.carritos.insert_one(data)
            return jsonify({'message': 'Registro almacenado con éxito!'}), 200
        if request.method == 'DELETE':
            db.carritos.delete_one({'_id': ObjectId(id)})
            return jsonify({'message': 'Registro eliminado con éxito!'}), 200
    except Exception as ex:
        return jsonify({'message': f'ERROR: {ex}'}), 400
    

@app.route('/pedidos', methods=['POST', 'GET'])
def pedidos():
    try:
        if request.method == 'POST':
            print('ha entrado a post')
            carrito = list(db.carritos.find({'remote_addr': request.remote_addr}))
            usr = dict(db.usuarios.find_one({'username': request.get_json()['username']}))

            for item in carrito:
                db.productos.update_one({'_id': ObjectId(item['id'])}, {'$inc': {'stock': -item['cantidad']}})

            db.pedidos.insert_one({
                'estado': 0,
                'direnvio': usr['direnvio'],
                'username': request.get_json()['username'],
                'fechahora': str(datetime.datetime.now()),
                'remote_addr': request.remote_addr,
                'carrito': carrito
            })

            db.carritos.delete_many({'remote_addr': request.remote_addr})
            return jsonify({'message': 'Pedido realizado con éxito!'}), 200
        if request.method == 'GET':
            data = db.pedidos.find({}).sort("fechahora", pymongo.DESCENDING)
            return json_util.dumps(data), 200
    except Exception as ex:
        return jsonify({'message': f'ERROR: {ex}'}), 400
    
@app.route('/mispedidos/<username>', methods=['GET'])
def mispedidos(username=None):
    try:
        if request.method == 'GET':
            data = db.pedidos.find({'username': username}).sort("fechahora", pymongo.DESCENDING)
            return json_util.dumps(data), 200
    except Exception as ex:
        return jsonify({'message': f'ERROR: {ex}'}), 400

@app.route('/flippedido/<id>', methods=['POST'])
def flippedido(id=None):
    try:
        if request.method == 'POST':
            data = dict(db.pedidos.find_one({'_id': ObjectId(id)}))
            nws = 0 if data['estado'] == 1 else 1
            db.pedidos.update_one({'_id': ObjectId(id)}, {'$set': {'estado': nws}}) 
            return jsonify({'estado': nws}), 200
    except Exception as ex:
        return jsonify({'message': f'ERROR: {ex}'}), 400


if __name__ == '__main__':
    app.run(debug=True)