import { Request, Response, NextFunction } from 'express';
import { KegiatanRepository } from '../repositories/kegiatan.repository';

export class KegiatanController {
  private kegiatanRepository: KegiatanRepository;

  constructor() {
    this.kegiatanRepository = new KegiatanRepository();
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = req.query.search as string || '';
      const statusFilter = req.query.status as string || '';
      const jenisFilter = req.query.jenis as string || '';
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const result = await this.kegiatanRepository.findAll(search, statusFilter, jenisFilter, limit, offset);
      
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
      const data = await this.kegiatanRepository.findById(id);
      if (!data) {
        return res.status(404).json({ status: 'error', message: 'Kegiatan not found' });
      }
      res.json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = await this.kegiatanRepository.create(req.body);
      res.status(201).json({ status: 'success', message: 'Kegiatan created', data: { id } });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const success = await this.kegiatanRepository.update(id, req.body);
      if (!success) {
        return res.status(404).json({ status: 'error', message: 'Kegiatan not found' });
      }
      res.json({ status: 'success', message: 'Kegiatan updated' });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const success = await this.kegiatanRepository.delete(id);
      if (!success) {
        return res.status(404).json({ status: 'error', message: 'Kegiatan not found' });
      }
      res.json({ status: 'success', message: 'Kegiatan deleted' });
    } catch (error) {
      next(error);
    }
  };

  uploadPoster = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (!req.file) {
        return res.status(400).json({ status: 'error', message: 'No file uploaded' });
      }
      
      const posterUrl = `/uploads/${req.file.filename}`;
      const success = await this.kegiatanRepository.updatePoster(id, posterUrl);
      
      if (!success) {
        return res.status(404).json({ status: 'error', message: 'Kegiatan not found' });
      }
      
      res.json({ status: 'success', message: 'Poster uploaded', data: { poster: posterUrl } });
    } catch (error) {
      next(error);
    }
  };
}
