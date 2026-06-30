import { useLogout } from '../../hooks/Auth/authHook';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearAccessToken } from '../../store/slices/tokenSlice';
import { clearAuth } from '../../store/slices/authSlice';
import { APP_ROUTES } from '../../constants/routes';
import { useToast } from '../../context/ToastContext';

const LogoutButton = () => {
  const { mutate: logout, isPending } = useLogout();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        dispatch(clearAccessToken());
        dispatch(clearAuth());
        toast('Logged out successfully', 'success');
        navigate(APP_ROUTES.LOGIN, { replace: true });
      },
      onError: () => {
        dispatch(clearAccessToken());
        dispatch(clearAuth());
        toast('Logged out with server error, but session cleared', 'info');
        navigate(APP_ROUTES.LOGIN, { replace: true });
      },
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="logout-button"
      title="Logout"
    >
      {isPending ? 'Logging out...' : 'Logout'}
    </button>
  );
};

export default LogoutButton;
