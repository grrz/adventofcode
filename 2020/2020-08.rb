def _input()
	f = File.open('2020-08-input')
	f.read.split("\n").map { |l| l.split ' '}
end

def loop(data, test)
	v = [0] * data.size
	a = 0
	i = 0

	# acc +30
	# nop -356
	# jmp -30

	while true
		return nil if i > data.size
		return nil if i < 0
		
		if i == data.size
			pp "finish: #{a}, #{test}: #{data[test.to_i]}"
			return a
		end

		if v[i] > 0
			pp "crash: #{a}, #{i}"
			return test.nil? ? a : nil 
		end
		v[i] = 1

		case data[i][0]
		when 'nop'
			i += 1
		when 'acc'
			a += data[i][1].to_i
			i += 1
		when 'jmp'
			i += data[i][1].to_i
		end

	end
end

# pp $data.filter { |i| i[0] == 'nop' }.size
# pp $data.filter { |i| i[0] == 'jmp' }.size


def test_loop(data_orig)
	r = nil
	for i in 0..data_orig.size-1
		case data_orig[i][0]
		when 'nop'
			data = data_orig.map(&:clone)
			data[i][0] = 'jmp'
			pp "test #{i}: #{data[i]}"
			r = loop(data, i)
		when 'jmp'
			data = data_orig.map(&:clone)
			data[i][0] = 'nop'
			pp "test #{i}: #{data[i]}"
			r = loop(data, i)
		end

		break if r
	end

	r
end

pp loop(_input(), nil)
# pp test_loop(_input())
