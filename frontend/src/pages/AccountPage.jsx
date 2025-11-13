import { useAppStore } from '../store/useAppStore';

const AccountPage = () => {
  const { user } = useAppStore();

  if (!user) {
    return (
      <div className="account-page">
        <p>Carregando informações do usuário...</p>
      </div>
    );
  }

  return (
    <div className="account-page">
      <h2 className="account-title">Minha Conta</h2>
      <div className="account-details">
        <div className="detail-item">
          <strong>Nome:</strong>
          <span>{user.name}</span>
        </div>
        <div className="detail-item">
          <strong>Email:</strong>
          <span>{user.email}</span>
        </div>
        <div className="detail-item">
          <strong>Membro desde:</strong>
          <span>{new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
