import { Request, Response, NextFunction } from 'express';
import { PesertaRepository } from '../repositories/peserta.repository';

export class PesertaController {
  private pesertaRepository: PesertaRepository;

  constructor() {
    this.pesertaRepository = new PesertaRepository();
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const kegiatanId = req.query.kegiatan_id ? parseInt(req.query.kegiatan_id as string) : undefined;
      const search = req.query.search as string || '';
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const result = await this.pesertaRepository.findAll(kegiatanId, search, limit, offset);
      
      res.json({
        status: 'success',
        data: result.data,
        pagination: {
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const data = await this.pesertaRepository.findById(id);
      if (!data) {
        return res.status(404).json({ status: 'error', message: 'Peserta not found' });
      }
      res.json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = await this.pesertaRepository.create(req.body);
      res.status(201).json({ status: 'success', message: 'Peserta created', data: { id } });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const success = await this.pesertaRepository.update(id, req.body);
      if (!success) {
        return res.status(404).json({ status: 'error', message: 'Peserta not found' });
      }
      res.json({ status: 'success', message: 'Peserta updated' });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const success = await this.pesertaRepository.delete(id);
      if (!success) {
        return res.status(404).json({ status: 'error', message: 'Peserta not found' });
      }
      res.json({ status: 'success', message: 'Peserta deleted' });
    } catch (error) {
      next(error);
    }
  };
}
