import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
const translations = {
    // Navigation
    'nav.home': {
        en: 'Home',
        es: 'Inicio',
        fr: 'Accueil',
        de: 'Startseite',
        zh: '首页',
        ja: 'ホーム',
        pt: 'Início'
    },
    'nav.onboarding': {
        en: 'Open Account',
        es: 'Abrir Cuenta',
        fr: 'Ouvrir un Compte',
        de: 'Konto Eröffnen',
        zh: '开户',
        ja: 'アカウント開設',
        pt: 'Abrir Conta'
    },
    'nav.admin': {
        en: 'Admin',
        es: 'Administración',
        fr: 'Admin',
        de: 'Admin',
        zh: '管理',
        ja: '管理',
        pt: 'Admin'
    },
    'nav.profile': {
        en: 'Profile',
        es: 'Perfil',
        fr: 'Profil',
        de: 'Profil',
        zh: '个人资料',
        ja: 'プロフィール',
        pt: 'Perfil'
    },
    'nav.reviewer': {
        en: 'Reviewer',
        es: 'Revisor',
        fr: 'Réviseur',
        de: 'Prüfer',
        zh: '审核员',
        ja: 'レビューアー',
        pt: 'Revisor'
    },
    'nav.login': {
        en: 'Login',
        es: 'Iniciar Sesión',
        fr: 'Connexion',
        de: 'Anmelden',
        zh: '登录',
        ja: 'ログイン',
        pt: 'Entrar'
    },
    'nav.register': {
        en: 'Register',
        es: 'Registrarse',
        fr: "S'inscrire",
        de: 'Registrieren',
        zh: '注册',
        ja: '登録',
        pt: 'Registrar'
    },
    // Landing Page
    'landing.title': {
        en: 'Intelligent Account\nOpening & Onboarding',
        es: 'Apertura de Cuenta\nInteligente y Onboarding',
        fr: 'Ouverture de Compte\nIntelligente et Onboarding',
        de: 'Intelligentes Konto-\neröffnung & Onboarding',
        zh: '智能账户\n开设与引导',
        ja: 'インテリジェントな口座\n開設とオンボーディング',
        pt: 'Abertura de Conta\nInteligente e Onboarding'
    },
    'landing.subtitle': {
        en: 'Reduce onboarding from days to minutes with autonomous AI agents handling KYC, document parsing, risk scoring, and AML screening — with full audit trails.',
        es: 'Reduce el onboarding de días a minutos con agentes de IA autónomos que manejan KYC, análisis de documentos, evaluación de riesgos y revisión AML — con rastros de auditoría completos.',
        fr: 'Réduisez l\'intégration de quelques jours à quelques minutes avec des agents IA autonomes gérant KYC, l\'analyse de documents, l\'évaluation des risques et le contrôle AML — avec des pistes d\'audit complètes.',
        de: 'Reduzieren Sie das Onboarding von Tagen auf Minuten mit autonomen KI-Agenten, die KYC, Dokumentenanalyse, Risikobewertung und AML-Prüfung übernehmen — mit vollständigen Audit-Trails.',
        zh: '通过自主AI代理处理KYC、文档解析、风险评分和AML筛选，将引导时间从几天减少到几分钟 — 具有完整的审计跟踪。',
        ja: '自律的なAIエージェントがKYC、文書解析、リスク評価、AMLスクリーニングを処理し、オンボーディングを日数から数分に短縮 — 完全な監査証跡付き。',
        pt: 'Reduza o onboarding de dias para minutos com agentes de IA autônomos lidando com KYC, análise de documentos, pontuação de risco e triagem AML — com trilhas de auditoria completas.'
    },
    'landing.startAccount': {
        en: 'Open an Account',
        es: 'Abrir Cuenta',
        fr: 'Ouvrir un Compte',
        de: 'Konto Eröffnen',
        zh: '开户',
        ja: 'アカウント開設',
        pt: 'Abrir Conta'
    },
    'landing.watchDemo': {
        en: 'Watch Demo',
        es: 'Ver Demo',
        fr: 'Voir Démo',
        de: 'Demo Ansehen',
        zh: '观看演示',
        ja: 'デモを見る',
        pt: 'Assistir Demo'
    },
    // Onboarding Steps
    'onboarding.title': {
        en: 'Open Your Account',
        es: 'Abrir Su Cuenta',
        fr: 'Ouvrez Votre Compte',
        de: 'Eröffnen Sie Ihr Konto',
        zh: '开设您的账户',
        ja: 'アカウントを開設',
        pt: 'Abra Sua Conta'
    },
    'onboarding.subtitle': {
        en: 'Complete in under 3 minutes — AI-powered verification',
        es: 'Complete en menos de 3 minutos — verificación con IA',
        fr: 'Terminez en moins de 3 minutes — vérification par IA',
        de: 'Fertigstellen in unter 3 Minuten — KI-gestützte Verifizierung',
        zh: '3分钟内完成 — AI驱动的验证',
        ja: '3分以内に完了 — AI搭載の検証',
        pt: 'Conclua em menos de 3 minutos — verificação com IA'
    },
    'onboarding.steps.identity': {
        en: 'Identity',
        es: 'Identidad',
        fr: 'Identité',
        de: 'Identität',
        zh: '身份',
        ja: '本人確認',
        pt: 'Identidade'
    },
    'onboarding.steps.financials': {
        en: 'Financials',
        es: 'Financieros',
        fr: 'Financiers',
        de: 'Finanzen',
        zh: '财务',
        ja: '財務',
        pt: 'Financeiro'
    },
    'onboarding.steps.document': {
        en: 'Document',
        es: 'Documento',
        fr: 'Document',
        de: 'Dokument',
        zh: '文档',
        ja: '書類',
        pt: 'Documento'
    },
    'onboarding.steps.processing': {
        en: 'Processing',
        es: 'Procesando',
        fr: 'Traitement',
        de: 'Verarbeitung',
        zh: '处理中',
        ja: '処理中',
        pt: 'Processando'
    },
    'onboarding.steps.decision': {
        en: 'Decision',
        es: 'Decisión',
        fr: 'Décision',
        de: 'Entscheidung',
        zh: '决定',
        ja: '決定',
        pt: 'Decisão'
    },
    'onboarding.steps.video': {
        en: 'Video',
        es: 'Video',
        fr: 'Vidéo',
        de: 'Video',
        zh: '视频',
        ja: 'ビデオ',
        pt: 'Vídeo'
    },
    // Form Fields
    'form.firstName': {
        en: 'First Name',
        es: 'Nombre',
        fr: 'Prénom',
        de: 'Vorname',
        zh: '名',
        ja: '名',
        pt: 'Nome'
    },
    'form.lastName': {
        en: 'Last Name',
        es: 'Apellido',
        fr: 'Nom',
        de: 'Nachname',
        zh: '姓',
        ja: '姓',
        pt: 'Sobrenome'
    },
    'form.email': {
        en: 'Email Address',
        es: 'Correo Electrónico',
        fr: 'Adresse Email',
        de: 'E-Mail-Adresse',
        zh: '电子邮件地址',
        ja: 'メールアドレス',
        pt: 'Endereço de Email'
    },
    'form.phone': {
        en: 'Phone Number',
        es: 'Número de Teléfono',
        fr: 'Numéro de Téléphone',
        de: 'Telefonnummer',
        zh: '电话号码',
        ja: '電話番号',
        pt: 'Número de Telefone'
    },
    'form.address': {
        en: 'Address',
        es: 'Dirección',
        fr: 'Adresse',
        de: 'Adresse',
        zh: '地址',
        ja: '住所',
        pt: 'Endereço'
    },
    'form.city': {
        en: 'City',
        es: 'Ciudad',
        fr: 'Ville',
        de: 'Stadt',
        zh: '城市',
        ja: '市',
        pt: 'Cidade'
    },
    'form.country': {
        en: 'Country',
        es: 'País',
        fr: 'Pays',
        de: 'Land',
        zh: '国家',
        ja: '国',
        pt: 'País'
    },
    'form.postalCode': {
        en: 'Postal Code',
        es: 'Código Postal',
        fr: 'Code Postal',
        de: 'Postleitzahl',
        zh: '邮政编码',
        ja: '郵便番号',
        pt: 'Código Postal'
    },
    // Actions
    'action.next': {
        en: 'Next',
        es: 'Siguiente',
        fr: 'Suivant',
        de: 'Weiter',
        zh: '下一步',
        ja: '次へ',
        pt: 'Próximo'
    },
    'action.previous': {
        en: 'Previous',
        es: 'Anterior',
        fr: 'Précédent',
        de: 'Zurück',
        zh: '上一步',
        ja: '前へ',
        pt: 'Anterior'
    },
    'action.submit': {
        en: 'Submit',
        es: 'Enviar',
        fr: 'Soumettre',
        de: 'Senden',
        zh: '提交',
        ja: '送信',
        pt: 'Enviar'
    },
    'action.continue': {
        en: 'Continue',
        es: 'Continuar',
        fr: 'Continuer',
        de: 'Weiter',
        zh: '继续',
        ja: '続行',
        pt: 'Continuar'
    },
    'action.save': {
        en: 'Save',
        es: 'Guardar',
        fr: 'Sauvegarder',
        de: 'Speichern',
        zh: '保存',
        ja: '保存',
        pt: 'Salvar'
    },
    'action.cancel': {
        en: 'Cancel',
        es: 'Cancelar',
        fr: 'Annuler',
        de: 'Abbrechen',
        zh: '取消',
        ja: 'キャンセル',
        pt: 'Cancelar'
    },
    // Status Messages
    'status.processing': {
        en: 'Processing...',
        es: 'Procesando...',
        fr: 'Traitement...',
        de: 'Verarbeitung...',
        zh: '处理中...',
        ja: '処理中...',
        pt: 'Processando...'
    },
    'status.approved': {
        en: 'Approved',
        es: 'Aprobado',
        fr: 'Approuvé',
        de: 'Genehmigt',
        zh: '已批准',
        ja: '承認済み',
        pt: 'Aprovado'
    },
    'status.rejected': {
        en: 'Rejected',
        es: 'Rechazado',
        fr: 'Rejeté',
        de: 'Abgelehnt',
        zh: '已拒绝',
        ja: '拒否',
        pt: 'Rejeitado'
    },
    'status.manualReview': {
        en: 'Manual Review',
        es: 'Revisión Manual',
        fr: 'Révision Manuelle',
        de: 'Manuelle Prüfung',
        zh: '人工审核',
        ja: '手動レビュー',
        pt: 'Revisão Manual'
    },
    // Errors
    'error.required': {
        en: 'This field is required',
        es: 'Este campo es obligatorio',
        fr: 'Ce champ est obligatoire',
        de: 'Dieses Feld ist erforderlich',
        zh: '此字段为必填项',
        ja: 'この項目は必須です',
        pt: 'Este campo é obrigatório'
    },
    'error.email': {
        en: 'Please enter a valid email address',
        es: 'Por favor ingrese un correo electrónico válido',
        fr: 'Veuillez entrer une adresse email valide',
        de: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
        zh: '请输入有效的电子邮件地址',
        ja: '有効なメールアドレスを入力してください',
        pt: 'Por favor insira um endereço de email válido'
    },
    'error.phone': {
        en: 'Please enter a valid phone number',
        es: 'Por favor ingrese un número de teléfono válido',
        fr: 'Veuillez entrer un numéro de téléphone valide',
        de: 'Bitte geben Sie eine gültige Telefonnummer ein',
        zh: '请输入有效的电话号码',
        ja: '有効な電話番号を入力してください',
        pt: 'Por favor insira um número de telefone válido'
    },
    // Video Verification
    'videoVerification.title': {
        en: 'Video Verification',
        es: 'Verificación por Video',
        fr: 'Vérification Vidéo',
        de: 'Video-Verifizierung',
        zh: '视频验证',
        ja: 'ビデオ認証',
        pt: 'Verificação por Vídeo'
    },
    'videoVerification.subtitle': {
        en: 'Enhanced security with live video verification for KYC compliance',
        es: 'Seguridad mejorada con verificación de video en vivo para cumplimiento KYC',
        fr: 'Sécurité améliorée avec vérification vidéo en direct pour la conformité KYC',
        de: 'Verbesserte Sicherheit mit Live-Video-Verifizierung für KYC-Compliance',
        zh: '通过实时视频验证增强安全性以满足KYC合规要求',
        ja: 'KYCコンプライアンスのためのライブビデオ認証によるセキュリティ強化',
        pt: 'Segurança aprimorada com verificação de vídeo ao vivo para conformidade KYC'
    },
    'videoVerification.startRecording': {
        en: 'Start Recording',
        es: 'Comenzar Grabación',
        fr: 'Commencer l\'Enregistrement',
        de: 'Aufnahme Starten',
        zh: '开始录制',
        ja: '録画開始',
        pt: 'Iniciar Gravação'
    },
    'videoVerification.stopRecording': {
        en: 'Stop Recording',
        es: 'Detener Grabación',
        fr: 'Arrêter l\'Enregistrement',
        de: 'Aufnahme Stoppen',
        zh: '停止录制',
        ja: '録画停止',
        pt: 'Parar Gravação'
    },
    'videoVerification.retake': {
        en: 'Retake Video',
        es: 'Volver a Grabar',
        fr: 'Reprendre la Vidéo',
        de: 'Video Wiederholen',
        zh: '重新录制',
        ja: 'ビデオを再撮影',
        pt: 'Refazer Vídeo'
    },
    'videoVerification.submit': {
        en: 'Submit Video',
        es: 'Enviar Video',
        fr: 'Soumettre la Vidéo',
        de: 'Video Einreichen',
        zh: '提交视频',
        ja: 'ビデオを送信',
        pt: 'Enviar Vídeo'
    },
    'videoVerification.processing': {
        en: 'Processing Video...',
        es: 'Procesando Video...',
        fr: 'Traitement de la Vidéo...',
        de: 'Video wird verarbeitet...',
        zh: '正在处理视频...',
        ja: 'ビデオを処理中...',
        pt: 'Processando Vídeo...'
    },
    'videoVerification.processingSubtitle': {
        en: 'Our AI is verifying your identity. This usually takes less than a minute.',
        es: 'Nuestra IA está verificando su identidad. Esto generalmente toma menos de un minuto.',
        fr: 'Notre IA vérifie votre identité. Cela prend généralement moins d\'une minute.',
        de: 'Unsere KI überprüft Ihre Identität. Dies dauert normalerweise weniger als eine Minute.',
        zh: '我们的AI正在验证您的身份。这通常需要不到一分钟。',
        ja: '私たちのAIがあなたの身元を確認しています。通常は1分以内に完了します。',
        pt: 'Nossa IA está verificando sua identidade. Isso geralmente leva menos de um minuto.'
    },
    'videoVerification.instructions.title': {
        en: 'Video Verification Instructions',
        es: 'Instrucciones de Verificación por Video',
        fr: 'Instructions de Vérification Vidéo',
        de: 'Video-Verifizierungsanweisungen',
        zh: '视频验证说明',
        ja: 'ビデオ認証の説明',
        pt: 'Instruções de Verificação por Vídeo'
    },
    'videoVerification.instruction1': {
        en: 'Ensure your face is clearly visible and well-lit',
        es: 'Asegúrese de que su rostro sea claramente visible y esté bien iluminado',
        fr: 'Assurez-vous que votre visage est clairement visible et bien éclairé',
        de: 'Stellen Sie sicher, dass Ihr Gesicht klar sichtbar und gut beleuchtet ist',
        zh: '确保您的面部清晰可见且光线充足',
        ja: 'あなたの顔がはっきりと見え、十分な光があることを確認してください',
        pt: 'Certifique-se de que seu rosto esteja claramente visível e bem iluminado'
    },
    'videoVerification.instruction2': {
        en: 'Speak clearly and state your full name for verification',
        es: 'Hable claramente y diga su nombre completo para verificación',
        fr: 'Parlez clairement et énoncez votre nom complet pour vérification',
        de: 'Sprechen Sie deutlich und nennen Sie Ihren vollständigen Namen zur Verifizierung',
        zh: '清晰地说出您的全名以进行验证',
        ja: '検証のためにはっきりとお名前を言ってください',
        pt: 'Fale claramente e diga seu nome completo para verificação'
    },
    'videoVerification.instruction3': {
        en: 'The recording will automatically stop after 30 seconds',
        es: 'La grabación se detendrá automáticamente después de 30 segundos',
        fr: 'L\'enregistrement s\'arrêtera automatiquement après 30 secondes',
        de: 'Die Aufnahme wird nach 30 Sekunden automatisch gestoppt',
        zh: '录制将在30秒后自动停止',
        ja: '録画は30秒後に自動的に停止します',
        pt: 'A gravação parará automaticamente após 30 segundos'
    },
    'videoVerification.review.title': {
        en: 'Review Your Video',
        es: 'Revise su Video',
        fr: 'Examinez Votre Vidéo',
        de: 'Video Überprüfen',
        zh: '查看您的视频',
        ja: 'ビデオを確認',
        pt: 'Revise Seu Vídeo'
    },
    'error.cameraAccess': {
        en: 'Unable to access camera. Please ensure camera permissions are granted.',
        es: 'No se puede acceder a la cámara. Asegúrese de que los permisos de cámara estén concedidos.',
        fr: 'Impossible d\'accéder à la caméra. Veuillez vous assurer que les autorisations de caméra sont accordées.',
        de: 'Kein Zugriff auf Kamera möglich. Bitte stellen Sie sicher, dass Kameraberechtigungen erteilt wurden.',
        zh: '无法访问摄像头。请确保已授予摄像头权限。',
        ja: 'カメラにアクセスできません。カメラの権限が付与されていることを確認してください。',
        pt: 'Não é possível acessar a câmera. Certifique-se de que as permissões da câmera foram concedidas.'
    }
};
const LanguageContext = createContext(undefined);
const availableLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
];
export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('language');
        if (saved && availableLanguages.some(lang => lang.code === saved)) {
            return saved;
        }
        // Detect browser language
        const browserLang = navigator.language.split('-')[0];
        const detectedLang = availableLanguages.find(lang => lang.code === browserLang)?.code;
        return detectedLang || 'en';
    });
    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);
    const t = (key) => {
        return translations[key]?.[language] || translations[key]?.['en'] || key;
    };
    const value = {
        language,
        setLanguage,
        t,
        availableLanguages,
    };
    return (_jsx(LanguageContext.Provider, { value: value, children: children }));
}
export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
