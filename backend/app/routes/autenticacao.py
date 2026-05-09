from fastapi import APIRouter, Header, HTTPException
from app.schemas.autenticacao import RegisterSchema, LoginSchema
from app.utils.utils_jwt import hash_password, verify_password, create_access_token, decode_access_token
from app.utils.utils_auth import get_user_by_email, create_user, get_user_by_id

router = APIRouter(prefix="/auth", tags=["Auth"])


def serialize_user(user):
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
    }


@router.post("/register")
def register(data: RegisterSchema):
    if get_user_by_email(data.email.lower()):
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")

    new_user = {
        "name": data.name,
        "email": data.email.lower(),
        "password": hash_password(data.password),
    }
    created_user = create_user(new_user)
    token = create_access_token({"sub": str(created_user["_id"])})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": serialize_user(created_user),
    }


@router.post("/login")
def login(data: LoginSchema):
    user = get_user_by_email(data.email.lower())

    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="E-mail ou senha inválidos")

    token = create_access_token({"sub": str(user["_id"])})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": serialize_user(user),
    }

# Rota para obter os dados do usuário autenticado, decodificando o token de acesso e retornando as informações do usuário
@router.get("/me")
def me(authorization: str = Header(default=None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token não informado")

    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido")

    user_id = payload.get("sub")
    user = get_user_by_id(user_id)

    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
    }