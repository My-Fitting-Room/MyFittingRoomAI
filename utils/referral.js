import { supabase } from '../App';

const SERVER_URL = 'https://my-fitting-room-server.onrender.com';

/**
 * Redeems a friend's referral code for the currently signed-in user.
 *
 * Resolves to { success: true, referralTokens } on success.
 * On failure, throws an Error whose `.code` is one of:
 *   'invalid_code' | 'self_referral' | 'already_redeemed'
 *   | 'unauthenticated' | 'network' | 'unknown'
 * so the UI can show a distinct message for each.
 */
export const redeemReferralCode = async (rawCode) => {
    const code = (rawCode || '').trim();
    if (!code) {
        const err = new Error('No code provided');
        err.code = 'invalid_code';
        throw err;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        const err = new Error('Authentication required');
        err.code = 'unauthenticated';
        throw err;
    }

    let response;
    try {
        response = await fetch(`${SERVER_URL}/api/referral/use-code`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });
    } catch (e) {
        const err = new Error('Network error');
        err.code = 'network';
        throw err;
    }

    const rawBody = await response.text();
    let data = {};
    try { data = JSON.parse(rawBody); } catch (e) { /* tolerate non-JSON body */ }

    if (!response.ok) {
        const err = new Error(data?.error || data?.code || data?.message || 'Referral failed');
        err.code = data?.error || data?.code || 'unknown';
        throw err;
    }

    return { success: true, referralTokens: data?.referral_tokens };
};
