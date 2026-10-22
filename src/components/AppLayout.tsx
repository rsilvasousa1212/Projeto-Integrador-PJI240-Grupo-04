import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { clearUser, getUser, updateUserRole, UserProfile } from '../services/authStorage';

export type RotaAtiva = 'dashboard' | 'materiais' | 'relatorios' | 'movimentacoes' | 'novo-patrimonio';

interface AppLayoutProps {
  children: React.ReactNode;
  rotaAtiva: RotaAtiva;
  titulo?: string;
  subtitulo?: string;
}

interface MenuItem {
  chave: RotaAtiva;
  label: string;
  descricao: string;
  rota: string;
  icone: keyof typeof Feather.glyphMap;
  somenteAdmin?: boolean;
}

const ITENS_MENU: MenuItem[] = [
  {
    chave: 'dashboard',
    label: 'Visão Geral',
    descricao: 'Painel e indicadores',
    rota: '/dashboard',
    icone: 'pie-chart',
  },
  {
    chave: 'materiais',
    label: 'Consulta de Materiais',
    descricao: 'Catálogo de patrimônios',
    rota: '/materiais',
    icone: 'box',
  },
  {
    chave: 'relatorios',
    label: 'Relatórios & Auditoria',
    descricao: 'Métricas e histórico',
    rota: '/relatorios',
    icone: 'file-text',
  },
  {
    chave: 'movimentacoes',
    label: 'Movimentações',
    descricao: 'Remanejamentos de bens',
    rota: '/movimentacoes',
    icone: 'repeat',
  },
  {
    chave: 'novo-patrimonio',
    label: 'Cadastrar Patrimônio',
    descricao: 'Novo bem municipal',
    rota: '/novo-patrimonio',
    icone: 'plus-circle',
    somenteAdmin: true,
  },
];

export function AppLayout({ children, rotaAtiva, titulo, subtitulo }: AppLayoutProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 860;

  const [usuario, setUsuario] = useState<UserProfile>(() => getUser());
  const [drawerAberto, setDrawerAberto] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const recarregar = () => setUsuario(getUser());
      window.addEventListener('focus', recarregar);
      return () => window.removeEventListener('focus', recarregar);
    }
  }, []);

  const handleNavegar = (rota: string) => {
    setDrawerAberto(false);
    router.push(rota as any);
  };

  const handleLogout = () => {
    clearUser();
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.history) {
      window.history.replaceState(null, '', '/');
    }
    router.replace('/');
  };

  const handleAlternarPerfil = () => {
    const novoPerfil = usuario.role === 'ADMIN' ? 'USER' : 'ADMIN';
    const atualizado = updateUserRole(novoPerfil);
    setUsuario(atualizado);
  };

  const renderConteudoSidebar = () => (
    <View style={styles.sidebarContainer}>
      <View style={styles.brandContainer}>
        <View style={styles.brandIconWrapper}>
          <MaterialIcons name="health-and-safety" size={26} color="#ffffff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.brandTitle}>Gestão Patrimonial</Text>
          <Text style={styles.brandSubtitle}>SMS Diadema</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.navSectionLabel}>MENU PRINCIPAL</Text>
        {ITENS_MENU.map((item) => {
          if (item.somenteAdmin && usuario.role !== 'ADMIN') {
            return null;
          }

          const ativo = rotaAtiva === item.chave;

          return (
            <TouchableOpacity
              key={item.chave}
              style={[styles.menuItem, ativo && styles.menuItemAtivo]}
              activeOpacity={0.7}
              onPress={() => handleNavegar(item.rota)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Navegar para ${item.label}`}
              accessibilityState={{ selected: ativo }}
            >
              <View style={[styles.menuIconBox, ativo && styles.menuIconBoxAtivo]}>
                <Feather
                  name={item.icone}
                  size={19}
                  color={ativo ? '#2563eb' : '#64748b'}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuItemLabel, ativo && styles.menuItemLabelAtivo]}>
                  {item.label}
                </Text>
                <Text style={styles.menuItemDescricao}>{item.descricao}</Text>
              </View>
              {ativo && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.userFooterCard}>
        <View style={styles.userInfoRow}>
          {usuario.picture ? (
            <Image source={{ uri: usuario.picture }} style={styles.userAvatar} />
          ) : (
            <View style={styles.userAvatarFallback}>
              <Text style={styles.userAvatarInitials}>
                {usuario.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.userName} numberOfLines={1}>
              {usuario.name}
            </Text>
            <View style={styles.roleBadgeContainer}>
              <Text style={styles.roleBadgeText}>
                {usuario.role === 'ADMIN' ? '🛡️ Administrador' : '👁️ Consulta'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.toggleRoleButton}
          activeOpacity={0.7}
          onPress={handleAlternarPerfil}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Alternar perfil para ${usuario.role === 'ADMIN' ? 'Modo Consulta' : 'Modo Administrador'}`}
        >
          <Feather name="refresh-cw" size={12} color="#0284c7" style={{ marginRight: 6 }} />
          <Text style={styles.toggleRoleText}>
            Mudar para {usuario.role === 'ADMIN' ? 'Consulta' : 'Admin'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.7}
          onPress={handleLogout}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Sair do sistema e encerrar sessão"
        >
          <AntDesign name="logout" size={14} color="#dc2626" style={{ marginRight: 6 }} />
          <Text style={styles.logoutText}>Sair do Sistema</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      {isDesktop ? (
        <View style={styles.desktopLayout}>
          <View style={styles.desktopSidebar}>{renderConteudoSidebar()}</View>
          <View style={styles.desktopMainContent}>
            {titulo && (
              <View style={styles.desktopTopBar}>
                <View>
                  <Text style={styles.desktopPageTitle}>{titulo}</Text>
                  {subtitulo ? (
                    <Text style={styles.desktopPageSubtitle}>{subtitulo}</Text>
                  ) : null}
                </View>
                <View style={styles.desktopTopBarRight}>
                  <View style={styles.statusPill}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusPillText}>Rede Municipal Ativa</Text>
                  </View>
                </View>
              </View>
            )}
            <View style={{ flex: 1 }}>{children}</View>
          </View>
        </View>
      ) : (
        <View style={styles.mobileLayout}>
          <View style={styles.mobileTopBar}>
            <TouchableOpacity
              style={styles.hamburgerButton}
              activeOpacity={0.7}
              onPress={() => setDrawerAberto(true)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Abrir menu de navegação"
            >
              <Feather name="menu" size={24} color="#0f172a" />
            </TouchableOpacity>

            <View style={styles.mobileHeaderCenter}>
              <Text style={styles.mobileHeaderTitle}>{titulo || 'Gestão de Patrimônio'}</Text>
              <Text style={styles.mobileHeaderSub}>SMS Diadema</Text>
            </View>

            <TouchableOpacity
              style={styles.mobileAvatarButton}
              activeOpacity={0.7}
              onPress={() => setDrawerAberto(true)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Perfil de ${usuario.name}`}
            >
              {usuario.picture ? (
                <Image source={{ uri: usuario.picture }} style={styles.mobileAvatar} />
              ) : (
                <View style={styles.mobileAvatarFallback}>
                  <Text style={styles.mobileAvatarText}>
                    {usuario.name?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>{children}</View>

          <Modal
            visible={drawerAberto}
            transparent
            animationType="fade"
            onRequestClose={() => setDrawerAberto(false)}
          >
            <View style={styles.drawerBackdrop}>
              <TouchableOpacity
                style={styles.drawerBackdropClickable}
                activeOpacity={1}
                onPress={() => setDrawerAberto(false)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Fechar gaveta de navegação"
              />
              <View style={styles.drawerCard}>
                <View style={styles.drawerHeaderActions}>
                  <TouchableOpacity
                    style={styles.closeDrawerButton}
                    onPress={() => setDrawerAberto(false)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Fechar menu de navegação"
                  >
                    <AntDesign name="close" size={20} color="#64748b" />
                  </TouchableOpacity>
                </View>
                {renderConteudoSidebar()}
              </View>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  desktopLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  desktopSidebar: {
    width: 270,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
    height: '100%',
  },
  desktopMainContent: {
    flex: 1,
    height: '100%',
    backgroundColor: '#f8fafc',
  },
  desktopTopBar: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingHorizontal: 28,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  desktopPageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  desktopPageSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  desktopTopBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 6,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065f46',
  },
  mobileLayout: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  mobileTopBar: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 14,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hamburgerButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  mobileHeaderCenter: {
    alignItems: 'center',
  },
  mobileHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  mobileHeaderSub: {
    fontSize: 11,
    color: '#64748b',
  },
  mobileAvatarButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#2563eb',
  },
  mobileAvatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileAvatarText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    flexDirection: 'row',
  },
  drawerBackdropClickable: {
    flex: 1,
  },
  drawerCard: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 290,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 16,
  },
  drawerHeaderActions: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
  },
  closeDrawerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebarContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 6,
  },
  brandIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#0284c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0284c7',
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginBottom: 16,
  },
  navSectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
    position: 'relative',
  },
  menuItemAtivo: {
    backgroundColor: '#eff6ff',
  },
  menuIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIconBoxAtivo: {
    backgroundColor: '#dbeafe',
  },
  menuItemLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  menuItemLabelAtivo: {
    color: '#1e40af',
    fontWeight: '700',
  },
  menuItemDescricao: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 1,
  },
  activeIndicator: {
    position: 'absolute',
    right: 0,
    top: 8,
    bottom: 8,
    width: 3,
    backgroundColor: '#2563eb',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  userFooterCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 12,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  userAvatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0284c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userAvatarInitials: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  roleBadgeContainer: {
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284c7',
  },
  toggleRoleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f2fe',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  toggleRoleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0369a1',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  logoutText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#b91c1c',
  },
});
