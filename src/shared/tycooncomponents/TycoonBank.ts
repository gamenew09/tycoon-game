export interface TycoonBankInstance extends Model {
    BankGrabPad: Part;
    MoneyDisplay: Part & {
        MoneySurfaceGui: SurfaceGui & {
            MoneyLabel: TextLabel;
        };
    };
}
