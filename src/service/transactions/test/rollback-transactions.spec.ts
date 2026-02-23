import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RollbackTransactionsService } from "../rollback-transactions.service";

describe("RollbackTransactionsService", () => {
	let accountRepository: any;
	let transactionsRepository: any;

	beforeEach(async () => {
		transactionsRepository = {
			save: vi.fn(),
			rollback: vi.fn(),
			findRollbackDetail: vi.fn(),
		};
		accountRepository = {
			findByAccountDetail: vi.fn(),
		};
	});
	afterEach(() => {
		 vi.clearAllMocks()
	})


	it("Validar transação não existente", async () => {

		vi.spyOn(transactionsRepository, "findRollbackDetail")

		const sut = new RollbackTransactionsService(
			transactionsRepository,
			accountRepository,
		);
		await expect(sut.execute('transactionId', 'userId')).rejects.toThrowError(
			'Transação não encontrada',
		);
	});

	it("Validar tipo de transação", async () => {

		vi.spyOn(transactionsRepository, "findRollbackDetail").mockResolvedValue({
			typeTransaction: 'transferOut'
		})
		
		const sut = new RollbackTransactionsService(
			transactionsRepository,
			accountRepository,
		);

		await expect(sut.execute('transactionId', 'userId')).rejects.toThrowError(
			'Tipo de transação inválida para rollback',
		);
	});

	it("Validar status da transação diferente de 'success'", async () => {

		vi.spyOn(transactionsRepository, "findRollbackDetail").mockResolvedValue({
			statusTransaction: 'rollback',
			typeTransaction: 'Out'
		})

		const sut = new RollbackTransactionsService(
			transactionsRepository,
			accountRepository,
		);
		await expect(sut.execute('transactionId', 'userId')).rejects.toThrowError(
			'Tipo de transação inválida para rollback',
		);
	});

	it('Validar transação de rollback', async () => {

		vi.spyOn(transactionsRepository, "findRollbackDetail").mockResolvedValue({
			statusTransaction: 'success',
			typeTransaction: 'transferIn',
			amount: 1000,
			account: {
				 id: 'accountId',
				 version: 1,
				 balance: 1000,
			},
			owner: {
				 bankAccount: '123'
			},
			creditId: 'creditId',
			debitId: 'debitId',
		})

		vi.spyOn(transactionsRepository, 'rollback')

		vi.spyOn(accountRepository, 'findByAccountDetail').mockResolvedValue({
			id: 'accountId',
			balance: 1000,
			version: 1,
		})

	   const saveSpy = vi.spyOn(transactionsRepository, 'save')

		const sut = new RollbackTransactionsService(
			transactionsRepository,
			accountRepository,
		);
		await sut.execute('transactionId', 'userId')

		expect(saveSpy).toHaveBeenCalled()
		expect(saveSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				transaction: expect.objectContaining({
					description: 'Extorno de transação',
					accountId: 'accountId',
					statusTransaction: 'success',
					typeTransaction: 'transferIn'
				}),
				account: {
					version: 1,
					accountId: 'accountId',
				}
			})
		)

	})
	

});
