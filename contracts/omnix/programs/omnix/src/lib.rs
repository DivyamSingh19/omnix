use anchor_lang::prelude::*;

declare_id!("6RhuzT1Ci47QLdbTnTEqmqsydKVPXvP3MZzUmv2pE3T");

#[program]
pub mod omnix {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
